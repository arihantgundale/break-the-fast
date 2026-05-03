import { useEffect } from 'react';

export default function DishDetailModal({ item, onClose, onAddToCart }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white max-w-3xl w-full rounded-2xl overflow-hidden shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative bg-gray-100">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full min-h-[280px] bg-gray-100" />
            )}
            {!item.isAvailable && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-bold text-lg bg-red-600 px-4 py-2 rounded">Out of Stock</span>
              </div>
            )}
          </div>

          <div className="p-6 md:p-8">
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="pure-veg-badge">Pure Veg</span>
                  {item.isSpicy && <span className="spicy-badge">Spicy</span>}
                </div>
                <h2 className="font-display text-2xl font-bold text-charcoal">{item.name}</h2>
                <p className="text-sm text-slate mt-1">{item.category}</p>
              </div>
              <button onClick={onClose} className="text-slate hover:text-charcoal text-2xl">×</button>
            </div>

            <p className="text-slate mt-4">{item.description}</p>

            {item.portionSize && (
              <p className="text-sm text-gray-500 mt-3">Portion: {item.portionSize}</p>
            )}

            {item.heritageNote && (
              <div className="mt-4 p-3 bg-cream rounded-lg">
                <p className="text-sm text-slate">{item.heritageNote}</p>
              </div>
            )}

            <div className="flex items-center justify-between mt-6">
              <span className="text-2xl font-bold text-primary">${Number(item.price).toFixed(2)}</span>
              <button
                onClick={onAddToCart}
                disabled={!item.isAvailable}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                  item.isAvailable
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {item.isAvailable ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
