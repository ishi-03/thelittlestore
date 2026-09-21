import { Heart, Truck, Mail, Phone, MapPin, Camera, Globe , Clock, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (form.name && form.email && form.message) setSubmitted(true);
  };

  const faqs = [
    {
      q: "How long does delivery take?",
      a: "Most orders are dispatched within 1–2 business days and delivered within 4–6 business days across India.",
    },
    {
      q: "Can I exchange a size?",
      a: "Yes! We accept size exchanges within 7 days of delivery, provided the item is unwashed and unused.",
    },
    {
      q: "Are your fabrics safe for newborns?",
      a: "Absolutely. All our fabrics are OEKO-TEX certified — free from harmful substances and tested for sensitive skin.",
    },
    {
      q: "Do you offer bulk or gifting orders?",
      a: "We love baby showers! Reach out to us at hello@thelittlestore.in for custom gifting and bulk order discounts.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F4] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'Playfair Display', serif; }
        input:focus, textarea:focus, select:focus { outline: none; border-color: #F9A8B8; box-shadow: 0 0 0 3px rgba(249,168,184,0.15); }
      `}</style>
      {/* Hero */}
      <section className="bg-[#FDE8EC] px-8 py-16 text-center relative overflow-hidden">
        <span className="absolute top-6 right-24 text-3xl opacity-25 select-none">🌙</span>
        <span className="absolute bottom-6 left-20 text-2xl opacity-20 select-none">✨</span>
        <span className="absolute top-8 left-1/3 text-xl opacity-15 select-none">⭐</span>

        <p className="text-xs tracking-[0.2em] uppercase text-[#F9A8B8] font-medium mb-4">Get in Touch</p>
        <h1 className="font-display text-5xl text-[#2D2D2D] mb-4">
          We'd love to <em className="text-[#F9A8B8] not-italic">hear from you.</em>
        </h1>
        <p className="text-[#8B7355] max-w-md mx-auto text-lg leading-relaxed">
          Questions, size advice, gifting ideas, or just want to say hi — we're real people and we
          reply to every message.
        </p>
      </section>

      {/* Main Grid */}
      <section className="px-8 py-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Left — Contact Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-[#F9A8B8] font-medium mb-5">Contact Details</p>
              <div className="flex flex-col gap-4">
                {[
                  { icon: <Mail className="w-4 h-4" />, label: "Email", val: "hello@thelittlestore.in" },
                  { icon: <Phone className="w-4 h-4" />, label: "WhatsApp", val: "+91 98765 43210" },
                  { icon: <MapPin className="w-4 h-4" />, label: "Studio", val: "Mumbai, Gujarat, India" },
                  { icon: <Clock className="w-4 h-4" />, label: "Hours", val: "Mon–Sat, 10am – 6pm" },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="flex items-start gap-4 bg-white rounded-2xl p-4 border border-[#F5EDE9] shadow-sm"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#FDE8EC] flex items-center justify-center text-[#F9A8B8] shrink-0">
                      {c.icon}
                    </div>
                    <div>
                      <p className="text-xs text-[#8B7355] mb-0.5">{c.label}</p>
                      <p className="text-sm font-medium text-[#2D2D2D]">{c.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#22C55E] flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#166534] text-sm mb-1">Chat on WhatsApp</p>
                <p className="text-xs text-[#166534] opacity-80 leading-relaxed mb-3">
                  Fastest replies! Most queries answered within an hour.
                </p>
                <button className="bg-[#22C55E] text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-[#16a34a] transition-colors">
                  Open WhatsApp →
                </button>
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-[#F9A8B8] font-medium mb-4">Follow Along</p>
              <div className="flex gap-3">
                {[
                  { icon: <Camera className="w-4 h-4" />, label: "@thelittlestore" },
                  { icon: <Globe  className="w-4 h-4" />, label: "thelittlestore" },
                ].map((s) => (
                  <button
                    key={s.label}
                    className="flex items-center gap-2 bg-white border border-[#F5EDE9] rounded-full px-4 py-2 text-sm text-[#8B7355] hover:border-[#F9A8B8] hover:text-[#F9A8B8] transition-colors shadow-sm"
                  >
                    {s.icon}
                    <span className="text-xs">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#F5EDE9]">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="text-6xl mb-5">🎀</div>
                  <h3 className="font-display text-3xl text-[#2D2D2D] mb-3">Message received!</h3>
                  <p className="text-[#8B7355] leading-relaxed max-w-sm">
                    Thank you, {form.name}! We'll get back to you at{" "}
                    <span className="text-[#F9A8B8] font-medium">{form.email}</span> within a few
                    hours.
                  </p>
                  <button
                    onClick={() => { setForm({ name: "", email: "", subject: "", message: "" }); setSubmitted(false); }}
                    className="mt-6 text-sm text-[#8B7355] underline hover:text-[#F9A8B8] transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs tracking-[0.2em] uppercase text-[#F9A8B8] font-medium mb-2">Write to Us</p>
                  <h2 className="font-display text-3xl text-[#2D2D2D] mb-7">Send a message</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-[#8B7355] font-medium mb-1.5 block">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Priya Sharma"
                        className="w-full border border-[#E8DDD8] rounded-xl px-4 py-3 text-sm text-[#2D2D2D] placeholder-[#C5B8B2] transition-all bg-[#FAF7F4]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#8B7355] font-medium mb-1.5 block">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full border border-[#E8DDD8] rounded-xl px-4 py-3 text-sm text-[#2D2D2D] placeholder-[#C5B8B2] transition-all bg-[#FAF7F4]"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-xs text-[#8B7355] font-medium mb-1.5 block">Subject</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full border border-[#E8DDD8] rounded-xl px-4 py-3 text-sm text-[#2D2D2D] bg-[#FAF7F4] transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select a topic</option>
                      <option>Order & Delivery</option>
                      <option>Size Guidance</option>
                      <option>Returns & Exchanges</option>
                      <option>Gifting & Bulk Orders</option>
                      <option>Product Question</option>
                      <option>Something else</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="text-xs text-[#8B7355] font-medium mb-1.5 block">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell us how we can help…"
                      className="w-full border border-[#E8DDD8] rounded-xl px-4 py-3 text-sm text-[#2D2D2D] placeholder-[#C5B8B2] transition-all bg-[#FAF7F4] resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full bg-[#F9A8B8] hover:bg-[#f594a8] text-white font-medium py-3.5 rounded-full transition-colors shadow-sm text-sm"
                  >
                    Send Message →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white px-8 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.2em] uppercase text-[#F9A8B8] font-medium mb-3">Quick Answers</p>
            <h2 className="font-display text-4xl text-[#2D2D2D]">Frequently asked questions</h2>
          </div>
          <div className="flex flex-col gap-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="bg-[#FAF7F4] rounded-2xl p-6 border border-[#F5EDE9]"
              >
                <p className="font-semibold text-[#2D2D2D] mb-2 text-sm flex items-start gap-2">
                  <span className="text-[#F9A8B8] shrink-0">✦</span>
                  {faq.q}
                </p>
                <p className="text-[#8B7355] text-sm leading-relaxed pl-5">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#F5EDE9] px-8 py-8 text-center text-sm text-[#8B7355]">
        <div className="flex items-center justify-center gap-1 font-display text-lg text-[#2D2D2D] mb-2">
          the little store <Heart className="w-4 h-4 fill-[#F9A8B8] text-[#F9A8B8]" />
        </div>
        <p className="text-xs tracking-widest uppercase mb-3">Cozy Nights. Happy Babies.</p>
        <p className="text-xs">© 2025 The Little Store. Made with love in Mumbai.</p>
      </footer>
    </div>
  );
}