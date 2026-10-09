import React from "react";
import { Link } from "react-router-dom";

/**
 * Policy pages — Privacy, Terms, Refund/Return/Cancellation, Shipping.
 * All text lives in the objects below; edit the wording there.
 * Business details come from the constants right under this comment.
 */

const BRAND = "The Little Store";
const EMAIL = "surangibanka@gmail.com";
const WHATSAPP = "+91 98927 34880";
const HOURS = "Mon–Sat, 10am – 6pm";
const LAST_UPDATED = "9 October 2026";

const PINK = "#f4a7b9";
const DARK = "#2d2d2d";
const MUTED = "#6f6168";
const BORDER = "#f0e8e0";

/* body items: a string = paragraph, { list: [...] } = bullet list */

const PRIVACY = {
  eyebrow: "Legal",
  title: "Privacy Policy",
  intro: `${BRAND} respects your privacy. This policy explains what information we collect when you shop with us, how we use it, and the choices you have.`,
  sections: [
    {
      title: "Information we collect",
      body: [
        "When you place an order or contact us, we collect the details you give us:",
        { list: [
          "Name, mobile number and email address",
          "Delivery address (street, city, state, pincode)",
          "Order details such as items, sizes and order number",
          "Messages you send us through the contact form or WhatsApp",
        ] },
        "Your cart and favourites are saved in your own browser (local storage) so they are still there when you come back. We do not need an account to shop.",
      ],
    },
    {
      title: "How we use your information",
      body: [
        { list: [
          "To process, pack, ship and deliver your order",
          "To send order confirmations, shipping updates and support replies",
          "To let you track your order using your order number and phone number",
          "To improve our products, website and customer service",
          "To send offers or newsletters only if you have signed up for them — you can unsubscribe at any time",
        ] },
      ],
    },
    {
      title: "Payments",
      body: [
        "Online payments are handled by our payment partner, Razorpay. Your card, UPI or net-banking details are entered on their secure checkout and are never stored on our servers. We only receive a confirmation of whether the payment succeeded, along with a payment reference.",
      ],
    },
    {
      title: "Who we share it with",
      body: [
        "We do not sell or rent your personal information. We share only what is needed with:",
        { list: [
          "Courier and logistics partners, to deliver your order",
          "Our payment partner, to process your payment",
          "Authorities, if we are legally required to do so",
        ] },
      ],
    },
    {
      title: "Data security and retention",
      body: [
        "We take reasonable steps to keep your information safe. No online system is completely risk-free, so we cannot guarantee absolute security. We keep order records for as long as needed to fulfil your order, handle returns and meet our accounting and legal obligations.",
      ],
    },
    {
      title: "Your choices",
      body: [
        `You can ask us to correct or delete your personal information, or opt out of marketing messages, by writing to ${EMAIL}. We will respond as soon as we reasonably can, subject to any records we must legally keep.`,
      ],
    },
    {
      title: "Children",
      body: [
        "Our products are for babies and children, but our website is meant for parents and adults. We do not knowingly collect personal information directly from children.",
      ],
    },
    {
      title: "Changes to this policy",
      body: [
        "We may update this policy from time to time. The latest version will always be on this page, with the date it was last updated.",
      ],
    },
  ],
};

const TERMS = {
  eyebrow: "Legal",
  title: "Terms & Conditions",
  intro: `By visiting or buying from ${BRAND}, you agree to the terms below. Please read them before placing an order.`,
  sections: [
    {
      title: "Using our website",
      body: [
        "You agree to use the website lawfully and to give accurate information when you place an order. You must not misuse the site, try to break its security, or use it for anything fraudulent.",
      ],
    },
    {
      title: "Products and sizes",
      body: [
        "We try to show colours, images and descriptions as accurately as possible, but screens differ, so slight variations may occur. Please check our Size Guide before ordering. All sizes are measured in cm and may vary slightly because our garments are handmade or cut by hand.",
      ],
    },
    {
      title: "Prices and payment",
      body: [
        { list: [
          "All prices are in Indian Rupees (₹).",
          "Prices and availability can change without notice. The price you see at checkout is the price you pay.",
          "Shipping charges are shown at checkout before you pay.",
          "Payments are processed securely through Razorpay.",
        ] },
      ],
    },
    {
      title: "Order acceptance",
      body: [
        "Your order is confirmed once payment is successful and you receive an order number. We may cancel an order if an item is out of stock, if there is a pricing or listing error, or if we cannot deliver to your address. In that case you will be refunded in full.",
      ],
    },
    {
      title: "Shipping, returns and refunds",
      body: [
        "Delivery is covered by our Shipping Policy, and exchanges, cancellations and refunds are covered by our Refund, Return & Cancellation Policy. Both form part of these terms.",
      ],
    },
    {
      title: "Intellectual property",
      body: [
        `All photos, text, logos and designs on this website belong to ${BRAND}. Please do not copy, reproduce or use them commercially without our written permission.`,
      ],
    },
    {
      title: "Limitation of liability",
      body: [
        `To the fullest extent permitted by law, ${BRAND} is not liable for indirect or consequential losses arising from the use of this website or our products. Our total liability for any order is limited to the amount you paid for that order.`,
      ],
    },
    {
      title: "Governing law",
      body: [
        "These terms are governed by the laws of India.",
      ],
    },
    {
      title: "Contact",
      body: [
        `Questions about these terms? Write to ${EMAIL} or message us on WhatsApp at ${WHATSAPP} (${HOURS}).`,
      ],
    },
  ],
};

const REFUND = {
  eyebrow: "Help",
  title: "Refund, Return & Cancellation Policy",
  intro: "We want you and your little one to love what you ordered. Here is how exchanges, cancellations and refunds work.",
  sections: [
    {
      title: "Size exchanges",
      body: [
        "We accept size exchanges within 7 days of delivery, provided the item is unwashed, unused and has its tags and packaging intact. To start an exchange, message us on WhatsApp or email us with your order number and the size you need.",
        "The exchange is subject to stock availability in the new size. Shipping for an exchange is paid by the customer unless the item was sent wrongly by us.",
      ],
    },
    {
      title: "Damaged, defective or wrong items",
      body: [
        "If your order arrives damaged, defective or different from what you ordered, please contact us within 48 hours of delivery with your order number and clear photos (an unboxing video helps). We will arrange a replacement or a refund at no extra cost to you.",
      ],
    },
    {
      title: "Items we cannot take back",
      body: [
        { list: [
          "Items that have been washed, worn or altered",
          "Items without original tags or packaging",
          "Customised or made-to-order gift sets and bulk orders, unless faulty",
        ] },
      ],
    },
    {
      title: "Cancelling an order",
      body: [
        "You can cancel an order before it is dispatched. Message us on WhatsApp or email us with your order number as soon as possible. Once an order has been shipped, it cannot be cancelled, but you may still be eligible for an exchange as described above.",
      ],
    },
    {
      title: "Refunds",
      body: [
        { list: [
          "Approved refunds are sent to your original payment method.",
          "Refunds usually reach you within 5–7 business days after approval. Your bank may take a little longer to show it.",
          "If money was deducted but your order was not confirmed, the amount is automatically refunded to your account, or the order is confirmed shortly after.",
          "Original shipping charges are not refunded, except when we are at fault.",
        ] },
      ],
    },
    {
      title: "How to reach us",
      body: [
        `Email ${EMAIL} or WhatsApp ${WHATSAPP} (${HOURS}). Please keep your order number handy — you can also check your order status on our Track Order page.`,
      ],
    },
  ],
};

const SHIPPING = {
  eyebrow: "Help",
  title: "Shipping Policy",
  intro: "We ship across India, carefully packed and ready to gift. Here is what to expect.",
  sections: [
    {
      title: "Processing and delivery time",
      body: [
        { list: [
          "Most orders are dispatched within 1–2 business days of payment confirmation.",
          "Delivery usually takes 4–6 business days across India after dispatch.",
          "Delivery can take longer during festivals, sales, bad weather or in remote areas.",
        ] },
      ],
    },
    {
      title: "Shipping charges",
      body: [
        "Shipping is charged per kg, based on the packed weight of your order. 1 kg is billed at the base rate, and each additional kg adds the same rate again. Orders are billed in whole kilograms, with a minimum of 1 kg.",
        { list: [
          "Mumbai: ₹50 per kg",
          "Rest of Gujarat and Maharashtra: ₹100 per kg",
          "Rest of India: ₹150 per kg",
        ] },
        "The exact shipping charge for your address is calculated and shown at checkout before you pay.",
      ],
    },
    {
      title: "Order tracking",
      body: [
        "After your order is placed you will receive an order number. You can check its status anytime on our Track Order page using your order number and the phone number you gave at checkout.",
      ],
    },
    {
      title: "Delivery address",
      body: [
        "Please double-check your address, pincode and phone number before paying. We are not responsible for delays or failed deliveries caused by an incorrect or incomplete address. Re-shipping may be charged.",
      ],
    },
    {
      title: "Damaged in transit",
      body: [
        "If your parcel looks tampered with or damaged when it arrives, please take photos before opening it and contact us within 48 hours. See our Refund, Return & Cancellation Policy for what we will do.",
      ],
    },
    {
      title: "Questions",
      body: [
        `Write to ${EMAIL} or WhatsApp ${WHATSAPP} (${HOURS}).`,
      ],
    },
  ],
};

const OTHER_LINKS = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms-and-conditions" },
  { label: "Refund & Returns", to: "/refund-policy" },
  { label: "Shipping Policy", to: "/shipping-policy" },
];

function PolicyLayout({ policy, path }) {
  return (
    <div style={{ fontFamily: '"Nunito", sans-serif', background: "#fdfbf9", minHeight: "100vh" }}>
      {/* Header */}
      <section
        style={{
          background: "linear-gradient(160deg, #fff4ea 0%, #fde8ee 60%, #f1e9fa 100%)",
          padding: "52px 20px 44px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            display: "inline-block",
            background: "#fff",
            color: "#b8486a",
            fontWeight: 800,
            fontSize: "0.8rem",
            padding: "6px 16px",
            borderRadius: "999px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
            marginBottom: "14px",
          }}
        >
          {policy.eyebrow}
        </span>
        <h1
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.7rem)",
            fontWeight: 800,
            color: "#34252e",
            margin: "0 0 10px",
            lineHeight: 1.15,
          }}
        >
          {policy.title}
        </h1>
        <p style={{ fontSize: "0.85rem", color: MUTED, margin: 0 }}>Last updated: {LAST_UPDATED}</p>
      </section>

      {/* Content */}
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "36px 20px 72px" }}>
        <div
          style={{
            background: "#fff",
            border: `1px solid ${BORDER}`,
            borderRadius: "20px",
            padding: "clamp(22px, 4vw, 40px)",
            boxShadow: "0 2px 14px rgba(0,0,0,0.04)",
          }}
        >
          <p style={{ fontSize: "1rem", color: DARK, lineHeight: 1.8, margin: "0 0 8px" }}>{policy.intro}</p>

          {policy.sections.map((s, i) => (
            <section key={s.title} style={{ marginTop: "28px" }}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: DARK, margin: "0 0 4px" }}>
                {i + 1}. {s.title}
              </h2>
              <div style={{ width: "32px", height: "3px", background: PINK, borderRadius: "2px", margin: "0 0 12px" }} />
              {s.body.map((b, j) =>
                typeof b === "string" ? (
                  <p key={j} style={{ fontSize: "0.95rem", color: MUTED, lineHeight: 1.85, margin: "0 0 10px" }}>
                    {b}
                  </p>
                ) : (
                  <ul key={j} style={{ margin: "0 0 10px", paddingLeft: "20px" }}>
                    {b.list.map((li) => (
                      <li key={li} style={{ fontSize: "0.95rem", color: MUTED, lineHeight: 1.85, marginBottom: "4px" }}>
                        {li}
                      </li>
                    ))}
                  </ul>
                )
              )}
            </section>
          ))}
        </div>

        {/* Other policies */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", marginTop: "28px" }}>
          {OTHER_LINKS.filter((l) => l.to !== path).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                textDecoration: "none",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "#b8486a",
                background: "#fff",
                border: "1px solid #f3dde2",
                borderRadius: "999px",
                padding: "8px 18px",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export const PrivacyPolicy = () => <PolicyLayout policy={PRIVACY} path="/privacy-policy" />;
export const TermsConditions = () => <PolicyLayout policy={TERMS} path="/terms-and-conditions" />;
export const RefundPolicy = () => <PolicyLayout policy={REFUND} path="/refund-policy" />;
export const ShippingPolicy = () => <PolicyLayout policy={SHIPPING} path="/shipping-policy" />;
