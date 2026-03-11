export default function CateringPage() {
  const platters = [
    {
      name: 'Mini Breakfast Platter',
      serves: '8–10',
      price: 49.99,
      items: ['Mini Idli Sambar', 'Poha', 'Masala Chai (10 cups)'],
    },
    {
      name: 'Classic Brunch Platter',
      serves: '15–20',
      price: 89.99,
      items: ['Masala Dosa (10)', 'Upma', 'Medu Vada (20)', 'Filter Coffee (20 cups)'],
    },
    {
      name: 'Grand Feast',
      serves: '25–30',
      price: 149.99,
      items: ['Chole Bhature', 'Pav Bhaji', 'Aloo Paratha (15)', 'Rava Kesari', 'Masala Chai (30 cups)'],
    },
    {
      name: 'Sweets & Snacks Box',
      serves: '10–12',
      price: 39.99,
      items: ['Rava Kesari', 'Motichoor Ladoo', 'Kachori Chaat', 'Samosa (12 pcs)'],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-charcoal text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Catering & Event Platters</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Bring the taste of India to your next gathering. Our catering platters are perfect for office breakfasts,
            community events, festivals, and family celebrations.
          </p>
        </div>
      </section>

      {/* Platters */}
      <section className="py-16 bg-cream">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-8">
          {platters.map((p) => (
            <div key={p.name} className="card p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-display text-xl font-bold text-charcoal">{p.name}</h3>
                <span className="text-primary font-bold text-lg">${p.price}</span>
              </div>
              <p className="text-sm text-slate mb-3">Serves {p.serves} people</p>
              <ul className="space-y-1">
                {p.items.map((item) => (
                  <li key={item} className="text-sm text-charcoal flex items-center gap-2">
                    <span className="text-pure-veg">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Inquiry form */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="section-title text-center mb-8">Request a Custom Catering Quote</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you! We will contact you within 24 hours.');
            }}
            className="card p-8 space-y-5"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Your Name *</label>
                <input type="text" required className="input-field" placeholder="Full Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Phone *</label>
                <input type="tel" required className="input-field" placeholder="+1 (555) 123-4567" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
              <input type="email" className="input-field" placeholder="you@example.com" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Event Date *</label>
                <input type="date" required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Number of Guests *</label>
                <input type="number" required min="1" className="input-field" placeholder="e.g. 25" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Details / Dietary Preferences</label>
              <textarea rows={4} className="input-field" placeholder="Tell us about your event and any preferences…" />
            </div>
            <button type="submit" className="btn-primary w-full text-lg py-3">
              Submit Inquiry
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
