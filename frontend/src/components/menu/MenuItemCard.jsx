import { useCart } from '../../context/CartContext';

export default function MenuItemCard({ item }) {
  const { addItem } = useCart();

  return (
    <div className="card group">
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🍛</div>
        )}
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="pure-veg-badge">🌿 Pure Veg</span>
          {item.isSpicy && <span className="spicy-badge">🌶️ Spicy</span>}
        </div>
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg bg-red-600 px-4 py-2 rounded">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display text-lg font-bold text-charcoal">{item.name}</h3>
          <span className="text-primary font-bold text-lg">${Number(item.price).toFixed(2)}</span>
        </div>

        <p className="text-slate text-sm mb-2 line-clamp-2">{item.description}</p>

        {item.portionSize && (
          <p className="text-xs text-gray-400 mb-3">📏 {item.portionSize}</p>
        )}

        <button
          onClick={() => addItem(item)}
          disabled={!item.isAvailable}
          className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
            item.isAvailable
              ? 'bg-primary text-white hover:bg-primary-dark'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {item.isAvailable ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}
