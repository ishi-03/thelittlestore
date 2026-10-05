// Pure cart helpers (no React, no storage) so the rules are easy to test.
// A cart line is keyed by product + selected variant, so the same product in
// two different ages/sizes is two separate lines.

export const MAX_NO_VARIANT_QTY = 99;

export const variantIdOf = (variant) =>
  variant ? (variant._id ? String(variant._id) : variant.age) : null;

export const buildKey = (productId, variantId) =>
  `${productId}:${variantId || "base"}`;

const fail = (items, message) => ({ ok: false, items, type: "error", message });

export function addToCart(items, product, variant, qty = 1) {
  const quantity = Number(qty);

  if (!product || !product._id) return fail(items, "This product is unavailable.");
  if (product.isActive === false) {
    return fail(items, "This product is currently unavailable.");
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return fail(items, "Please choose a valid quantity.");
  }

  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  if (hasVariants && !variant) return fail(items, "Please select a size first.");
  if (variant && !(Number(variant.stock) > 0)) {
    return fail(items, "This size is out of stock.");
  }

  const variantId = variantIdOf(variant);
  const key = buildKey(product._id, variantId);
  const max = variant ? Number(variant.stock) : MAX_NO_VARIANT_QTY;
  const existing = items.find((i) => i.key === key);
  const current = existing ? existing.quantity : 0;

  if (current >= max) {
    return fail(items, `Only ${max} available in this size and it's already in your cart.`);
  }

  const clamped = current + quantity > max;
  const line = {
    key,
    productId: String(product._id),
    variantId,
    age: variant ? variant.age : null,
    name: product.name,
    image: product.images?.[0] || "",
    price: Number(product.price),
    quantity: Math.min(current + quantity, max),
    stock: variant ? Number(variant.stock) : null,
    available: true,
  };

  return {
    ok: true,
    items: existing
      ? items.map((i) => (i.key === key ? { ...i, ...line } : i))
      : [...items, line],
    type: clamped ? "info" : "success",
    message: clamped ? `Only ${max} available, quantity set to ${max}.` : "Added to cart",
  };
}

export function setLineQuantity(items, key, qty) {
  const quantity = Number(qty);
  const item = items.find((i) => i.key === key);

  if (!item) return fail(items, "Item not found in your cart.");
  if (!item.available) {
    return fail(items, "This item is unavailable. Please remove it from your cart.");
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return fail(items, "Please choose a valid quantity.");
  }

  const max = item.stock ?? MAX_NO_VARIANT_QTY;
  if (quantity > max) {
    return {
      ok: true,
      items: items.map((i) => (i.key === key ? { ...i, quantity: max } : i)),
      type: "info",
      message: `Only ${max} available.`,
    };
  }

  return {
    ok: true,
    items: items.map((i) => (i.key === key ? { ...i, quantity } : i)),
    type: "success",
    message: "",
  };
}

// Refresh price / stock / availability from the latest product list.
export function syncItems(items, products) {
  const byId = new Map(products.map((p) => [String(p._id), p]));

  return items.map((item) => {
    const product = byId.get(item.productId);

    if (!product || product.isActive === false) {
      return { ...item, available: false, stock: 0 };
    }

    let variant = null;
    if (item.variantId) {
      variant = (product.variants || []).find((v) => variantIdOf(v) === item.variantId);
      if (!variant) return { ...item, available: false, stock: 0 };
    }

    const stock = variant ? Number(variant.stock) || 0 : null;
    const available = variant ? stock > 0 : true;

    return {
      ...item,
      name: product.name,
      image: product.images?.[0] || item.image,
      price: Number(product.price),
      stock,
      available,
      quantity: available && stock !== null ? Math.min(item.quantity, stock) : item.quantity,
    };
  });
}

export function cartTotals(items) {
  return {
    count: items.reduce((n, i) => n + i.quantity, 0),
    subtotal: items.reduce((n, i) => (i.available ? n + i.price * i.quantity : n), 0),
    hasUnavailable: items.some((i) => !i.available),
  };
}
