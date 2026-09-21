import { Heart, Star, Shield, Truck, Baby, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
export default function AboutPage() {
  const values = [
    {
      icon: <Baby className="w-6 h-6" />,
      title: "Baby-First Design",
      desc: "Every stitch, every fabric choice, every snap placement — made with your baby's comfort and safety as the only brief.",
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Premium Cotton",
      desc: "All our nightwear is made with 100% premium cotton — OEKO-TEX certified, breathable, and gentle on delicate skin. No harsh dyes, no synthetic fillers.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Rigorously Tested",
      desc: "Each product goes through multiple rounds of wash and wear testing before it ever reaches your nursery.",
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Free Shipping Over ₹999",
      desc: "Because a cozy night's sleep shouldn't come with delivery anxiety. Free shipping on all orders above ₹999.",
    },
  ];

  const milestones = [
    { year: "2018", label: "Founded", detail: "Started from a tiny home studio in Mumbai, made with love." },
    { year: "2021", label: "500+ Families", detail: "Reached our first 500 happy families — a milestone we're still emotional about." },
    { year: "2023", label: "OEKO-TEX Certified", detail: "Completed certification for all our core fabric lines. Safety, made official." },
    { year: "2025", label: "Pan-India Shipping", detail: "Now delivering cozy nights to every corner of India." },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F4] font-sans">
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'Playfair Display', serif; }
      `}</style>

    

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#FDE8EC] px-8 py-20">
        {/* Decorative motifs */}
        <span className="absolute top-8 right-24 text-4xl opacity-30 select-none">🌙</span>
        <span className="absolute top-16 right-48 text-2xl opacity-20 select-none">✨</span>
        <span className="absolute bottom-8 left-20 text-3xl opacity-20 select-none">⭐</span>
        <span className="absolute top-6 left-1/2 text-xl opacity-15 select-none">☁️</span>

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <p className="text-xs tracking-[0.2em] uppercase text-[#F9A8B8] font-medium mb-4">Our Story</p>
          <h1 className="font-display text-5xl text-[#2D2D2D] leading-tight mb-6">
            Made with love,<br />
            <em className="text-[#F9A8B8] not-italic">for the tiniest ones.</em>
          </h1>
          <p className="text-[#8B7355] text-lg leading-relaxed">
            The Little Store was born from a simple wish — that every baby deserves a night so soft,
            so warm, so perfectly held, that they drift off without a fuss. We're a small family-run
            studio, and every nightsuit we make carries a piece of that wish.
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className="px-8 py-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Illustration placeholder — warm toned */}
          <div className="relative">
            <div className="w-full aspect-square rounded-3xl bg-gradient-to-br from-[#FDE8EC] to-[#F9C4CE] flex items-center justify-center text-[8rem] shadow-sm">
              👩‍👧
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-md px-5 py-3 flex items-center gap-2">
              <Heart className="w-4 h-4 fill-[#F9A8B8] text-[#F9A8B8]" />
              <span className="text-sm font-medium text-[#2D2D2D]">Mother of Three</span>
            </div>
          </div>

          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#F9A8B8] font-medium mb-3">The Founder</p>
            <h2 className="font-display text-4xl text-[#2D2D2D] mb-5 leading-snug">
              Hi, I'm Surangi — <br />mother of three, maker, dreamer.
            </h2>
            <p className="text-[#8B7355] leading-relaxed mb-4">
              As a mother of three, I spent years searching for nightwear that was truly comfortable,
              safe, and beautiful for my kids — and kept coming up short. After struggling to find
              nightwear I actually trusted, I decided to create it myself. That's how The Little Store
              quietly began in 2018.
            </p>
            <p className="text-[#8B7355] leading-relaxed mb-6">
              Today we're a small but passionate team, still designing everything from our studio in
              Mumbai. Every piece is still checked by hand. Every fabric is still tested on our
              own kids first.
            </p>
            <div className="bg-white rounded-2xl border border-[#F5EDE9] p-5 mb-8">
              <p className="text-xs tracking-[0.15em] uppercase text-[#F9A8B8] font-medium mb-2">Our Mission</p>
              <p className="text-[#2D2D2D] text-sm leading-relaxed italic">
                Making bedtime more comfortable with soft, safe, and high-quality nightwear that
                children love and parents trust.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FDE8EC] flex items-center justify-center text-lg">👤</div>
              <div>
                <p className="font-display text-[#2D2D2D] text-lg italic">Surangi Agrawal</p>
                <p className="text-xs text-[#8B7355]">Founder, The Little Store</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.2em] uppercase text-[#F9A8B8] font-medium mb-3">What We Stand For</p>
            <h2 className="font-display text-4xl text-[#2D2D2D]">Our promises to you</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-[#FAF7F4] rounded-2xl p-6 hover:shadow-md transition-shadow border border-[#F5EDE9]"
              >
                <div className="w-11 h-11 rounded-xl bg-[#FDE8EC] flex items-center justify-center text-[#F9A8B8] mb-4">
                  {v.icon}
                </div>
                <h3 className="font-semibold text-[#2D2D2D] mb-2 text-sm">{v.title}</h3>
                <p className="text-[#8B7355] text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-8 py-20 max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.2em] uppercase text-[#F9A8B8] font-medium mb-3">Our Journey</p>
          <h2 className="font-display text-4xl text-[#2D2D2D]">A little history</h2>
        </div>
        <div className="relative">
          {/* Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#F9C4CE] -translate-x-1/2 hidden md:block" />
          <div className="flex flex-col gap-10">
            {milestones.map((m, i) => (
              <div
                key={m.year}
                className={`flex flex-col md:flex-row items-center gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F5EDE9] inline-block max-w-sm">
                    <p className="font-display text-[#F9A8B8] text-2xl mb-1">{m.year}</p>
                    <p className="font-semibold text-[#2D2D2D] mb-1">{m.label}</p>
                    <p className="text-sm text-[#8B7355] leading-relaxed">{m.detail}</p>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full bg-[#F9A8B8] border-4 border-white shadow-md z-10 shrink-0" />
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FDE8EC] px-8 py-20 text-center relative overflow-hidden">
        <span className="absolute top-6 left-16 text-3xl opacity-20 select-none">🌙</span>
        <span className="absolute bottom-8 right-20 text-2xl opacity-20 select-none">✨</span>
        <p className="text-xs tracking-[0.2em] uppercase text-[#F9A8B8] font-medium mb-4">Ready to shop?</p>
        <h2 className="font-display text-4xl text-[#2D2D2D] mb-4">
          Every baby deserves <em className="text-[#F9A8B8] not-italic">cozy nights.</em>
        </h2>
        <p className="text-[#8B7355] mb-8 max-w-md mx-auto">
          Browse our full range of nightsuits, romper suits, and sleep bags — all made for peaceful, happy sleep.
        </p>
       <Link
  to="/shop"
  className="bg-[#F9A8B8] hover:bg-[#f594a8] text-white font-medium px-8 py-3 rounded-full transition-colors shadow-sm inline-block"
>
  Shop Now
</Link>
        
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