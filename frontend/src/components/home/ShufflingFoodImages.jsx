import { useState, useEffect, useCallback } from 'react';

/**
 * High-quality Indian food image URLs (royalty-free / Unsplash).
 * Replace these with your own images if you prefer.
 */
const FOOD_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    alt: 'Paneer Tikka — smoky grilled cottage cheese cubes',
  },
  {
    src: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    alt: 'Crispy Masala Dosa with coconut chutney',
  },
  {
    src: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
    alt: 'Golden Samosas — crispy pastry with spiced filling',
  },
  {
    src: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    alt: 'Fluffy Idli served with sambar and chutney',
  },
  {
    src: 'https://images.unsplash.com/photo-1606491956689-2ea866880049?auto=format&fit=crop&w=800&q=80',
    alt: 'Rich Chole Bhature — puffy bread with spicy chickpeas',
  },
  {
    src: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80',
    alt: 'Aromatic Biryani — layered rice with vegetables',
  },
  {
    src: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    alt: 'Pav Bhaji — buttery bread with spiced mash',
  },
  {
    src: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=800&q=80',
    alt: 'Gulab Jamun — golden sweet dumplings in syrup',
  },
  {
    src: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
    alt: 'Vegetable Thali — assorted Indian dishes on a platter',
  },
  {
    src: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=800&q=80',
    alt: 'Aloo Gobi — spiced cauliflower and potato curry',
  },
];

/**
 * Displays a grid of tempting Indian food images that shuffle
 * with a smooth crossfade every few seconds.
 */
export default function ShufflingFoodImages() {
  const VISIBLE = 4; // number of images shown at once
  const INTERVAL = 2500; // ms between shuffles

  const [displayed, setDisplayed] = useState(() =>
    FOOD_IMAGES.slice(0, VISIBLE).map((img, i) => ({ ...img, key: i }))
  );
  const [pool] = useState(() => [...FOOD_IMAGES]);
  const [counter, setCounter] = useState(VISIBLE);

  const shuffle = useCallback(() => {
    setDisplayed((prev) => {
      // pick a random slot to replace
      const slotIndex = Math.floor(Math.random() * VISIBLE);
      const next = [...prev];
      const nextIndex = counter % pool.length;
      next[slotIndex] = { ...pool[nextIndex], key: Date.now() + Math.random() };
      return next;
    });
    setCounter((c) => c + 1);
  }, [counter, pool]);

  useEffect(() => {
    const timer = setInterval(shuffle, INTERVAL);
    return () => clearInterval(timer);
  }, [shuffle]);

  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-md lg:max-w-lg mx-auto">
      {displayed.map((img, idx) => (
        <div
          key={img.key}
          className="relative aspect-square rounded-2xl overflow-hidden shadow-xl food-card-enter"
          style={{ animationDelay: `${idx * 80}ms` }}
        >
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            loading="lazy"
          />
          {/* Subtle dark overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      ))}
    </div>
  );
}
