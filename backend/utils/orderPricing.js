// Pure helpers: no DB, no Express. The controller loads products from MongoDB
// and passes them in, so every price/stock decision is made from DB data and
// never from numbers sent by the browser.

const OBJECT_ID = /^[a-f\d]{24}$/i;
export const MAX_LINES = 50;
export const MAX_QTY_PER_LINE = 99;

// ---------- shipping ----------
// Rates are per kg (1 kg = the base rate, every extra kg adds the same rate again).
// All values can be overridden from .env without touching code.
const envNumber = (value, fallback) => {
  if (value === undefined || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};

export function getShippingRates(env = process.env) {
  const freeAbove = envNumber(env.FREE_SHIPPING_ABOVE, 0);
  return {
    mumbai: envNumber(env.SHIPPING_RATE_MUMBAI, 50),
    homeStates: envNumber(env.SHIPPING_RATE_GUJARAT_MAHARASHTRA, 100),
    other: envNumber(env.SHIPPING_RATE_OTHER, 150),
    freeAbove: freeAbove > 0 ? freeAbove : null, // off unless set in .env
    defaultWeightGrams: envNumber(env.DEFAULT_WEIGHT_GRAMS, 500) || 500,
  };
}

const norm = (v) => String(v ?? "").trim().toLowerCase().replace(/\s+/g, " ");

export function getShippingZone(state, city) {
  const s = norm(state);
  if (s === "maharashtra" && norm(city) === "mumbai") return "mumbai";
  if (s === "gujarat" || s === "maharashtra") return "homeStates";
  return "other";
}

// Couriers bill in whole kgs, so 1.2 kg is billed as 2 kg. Minimum 1 kg.
export const billableKg = (totalGrams) => Math.max(1, Math.ceil(Number(totalGrams || 0) / 1000));

export function computeShipping({ subtotal, state, city, totalGrams }, rates = getShippingRates()) {
  const kg = billableKg(totalGrams);
  if (rates.freeAbove !== null && subtotal > rates.freeAbove) {
    return { charge: 0, zone: getShippingZone(state, city), billableKg: kg };
  }
  const zone = getShippingZone(state, city);
  return { charge: rates[zone] * kg, zone, billableKg: kg };
}

// ---------- customer / address validation ----------
export function normalizePhone(input) {
  let digits = String(input ?? "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

const clean = (v, max) => String(v ?? "").trim().replace(/\s+/g, " ").slice(0, max);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateCheckoutDetails(body) {
  const c = body?.customer || {};
  const a = body?.address || {};

  const name = clean(c.name, 80);
  if (name.length < 2) return { ok: false, field: "name", message: "Please enter your full name." };

  const phone = normalizePhone(c.phone);
  if (!phone) return { ok: false, field: "phone", message: "Please enter a valid 10-digit mobile number." };

  const email = clean(c.email, 120).toLowerCase();
  if (!EMAIL.test(email)) return { ok: false, field: "email", message: "Please enter a valid email address." };

  const line1 = clean(a.line1, 160);
  if (line1.length < 5) return { ok: false, field: "line1", message: "Please enter your delivery address." };

  const city = clean(a.city, 60);
  if (city.length < 2) return { ok: false, field: "city", message: "Please enter your city." };

  const state = clean(a.state, 60);
  if (state.length < 2) return { ok: false, field: "state", message: "Please select your state." };

  const pincode = String(a.pincode ?? "").trim();
  if (!/^[1-9]\d{5}$/.test(pincode)) return { ok: false, field: "pincode", message: "Please enter a valid 6-digit pincode." };

  return {
    ok: true,
    customer: { name, phone, email },
    address: { line1, line2: clean(a.line2, 160), city, state, pincode },
  };
}

// ---------- cart lines -> priced order lines ----------
const fail = (status, message, code) => ({ ok: false, status, message, code });

export function priceItems(requested, products, defaultWeightGrams = 500) {
  if (!Array.isArray(requested) || requested.length === 0) {
    return fail(400, "Your cart is empty.", "EMPTY_CART");
  }
  if (requested.length > MAX_LINES) return fail(400, "Too many items in one order.", "TOO_MANY");

  // merge duplicate product+variant lines
  const merged = new Map();
  for (const line of requested) {
    const productId = String(line?.productId ?? "");
    const variantId = line?.variantId ? String(line.variantId) : null;
    const quantity = Number(line?.quantity);

    if (!OBJECT_ID.test(productId) || (variantId && !OBJECT_ID.test(variantId))) {
      return fail(400, "Some items in your cart are invalid. Please refresh your cart.", "INVALID_ITEM");
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY_PER_LINE) {
      return fail(400, "Invalid quantity in your cart.", "INVALID_QUANTITY");
    }
    const key = `${productId}:${variantId || "base"}`;
    const prev = merged.get(key);
    merged.set(key, { productId, variantId, quantity: (prev?.quantity || 0) + quantity });
  }

  const byId = new Map(products.map((p) => [String(p._id), p]));
  const items = [];
  let subtotal = 0;
  let totalGrams = 0;

  for (const { productId, variantId, quantity } of merged.values()) {
    const product = byId.get(productId);
    if (!product || product.isActive === false) {
      return fail(409, "An item in your cart is no longer available. Please review your cart.", "UNAVAILABLE");
    }

    const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
    let variant = null;

    if (hasVariants) {
      variant = variantId
        ? product.variants.find((v) => String(v._id) === variantId)
        : null;
      if (!variant) {
        return fail(409, `The selected size for "${product.name}" is no longer available.`, "UNAVAILABLE");
      }
      if (variant.stock < quantity) {
        const msg =
          variant.stock <= 0
            ? `"${product.name}" (${variant.age}) is out of stock.`
            : `Only ${variant.stock} of "${product.name}" (${variant.age}) left in stock.`;
        return fail(409, msg, "OUT_OF_STOCK");
      }
    }

    const price = Number(product.price);
    if (!Number.isFinite(price) || price < 0) {
      return fail(409, `"${product.name}" can't be purchased right now.`, "UNAVAILABLE");
    }

    items.push({
      product: product._id,
      variantId: variant ? variant._id : null,
      name: product.name,
      image: product.images?.[0] || "",
      age: variant ? variant.age : null,
      quantity,
      price,
    });
    subtotal += price * quantity;

    const grams = Number(product.weightGrams) > 0 ? Number(product.weightGrams) : defaultWeightGrams;
    totalGrams += grams * quantity;
  }

  return { ok: true, items, subtotal, totalGrams };
}

export const toPaise = (rupees) => Math.round(Number(rupees) * 100);
