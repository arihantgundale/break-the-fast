export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-charcoal text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Our Story</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            From a humble family kitchen in Gujarat to your breakfast table in America — Break The Fast brings
            100% pure vegetarian Indian flavors crafted with love, tradition, and the freshest ingredients.
          </p>
        </div>
      </section>

      {/* Heritage */}
      <section className="py-16 bg-cream">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-secondary font-semibold uppercase tracking-widest text-sm">Heritage</span>
            <h2 className="font-display text-3xl font-bold text-charcoal mt-2 mb-4">
              Rooted in Tradition, Made for Today
            </h2>
            <p className="text-slate leading-relaxed mb-4">
              Every recipe we serve carries the warmth of Indian mornings — the aroma of freshly ground spices,
              the sizzle of dosas on a hot tava, the rich sweetness of chai brewed just right.
            </p>
            <p className="text-slate leading-relaxed">
              Our founders grew up waking to these flavors and wanted to share that experience. Break The Fast
              was born from the belief that a great breakfast sets the tone for the entire day.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <span className="text-6xl block mb-4">🪷</span>
            <h3 className="font-display text-xl font-bold text-charcoal mb-2">100% Pure Vegetarian</h3>
            <p className="text-slate text-sm">
              We are proudly and entirely vegetarian. No meat, no eggs — just wholesome plant-based goodness
              inspired by India's rich vegetarian culinary heritage.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="section-title text-center mb-10">What We Stand For</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🌿', title: 'Fresh Ingredients', desc: 'Every dish is prepared fresh daily with locally sourced produce and authentic Indian spices.' },
              { icon: '🙏', title: 'Authentic Recipes', desc: 'Time-honored recipes passed down through generations, prepared the traditional way.' },
              { icon: '🌎', title: 'Community First', desc: 'We believe food brings people together. Our restaurant is a gathering place for the community.' },
            ].map((v) => (
              <div key={v.title} className="card p-6 text-center">
                <span className="text-4xl block mb-3">{v.icon}</span>
                <h3 className="font-display text-lg font-bold text-charcoal mb-2">{v.title}</h3>
                <p className="text-slate text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold mb-4">Taste the Tradition</h2>
          <p className="text-white/80 mb-6">Explore our menu and experience the authentic flavors of India — available for pickup.</p>
          <a href="/menu" className="inline-block bg-white text-primary font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
            Browse Our Menu →
          </a>
        </div>
      </section>
    </div>
  );
}
