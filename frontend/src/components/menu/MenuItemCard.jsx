import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { FiX } from 'react-icons/fi';

export default function MenuItemModal({ item, onClose }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl w-[400px] max-w-full overflow-hidden shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow"
        >
          <FiX className="w-4 h-4" />
        </button>

        {/* Image */}
        <div className="h-56 w-full overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-xs text-orange-500 font-semibold uppercase mb-1">
            {item.category?.replace('_', ' ')}
          </p>

          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">{item.name}</h2>
            <span className="text-red-600 font-bold text-lg">
              ${Number(item.price).toFixed(2)}
            </span>
          </div>

          <div className="flex gap-2 mb-3">
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
              Pure Veg
            </span>
            {item.portionSize && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                {item.portionSize}
              </span>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-3">{item.description}</p>

          {/* Heritage Note */}
          {item.heritageNote && (
            <div className="bg-yellow-50 p-3 rounded-lg text-sm text-gray-700 mb-4">
              <strong>Heritage Note:</strong>
              <p>{item.heritageNote}</p>
            </div>
          )}

          {/* Quantity + Add */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-1"
              >
                -
              </button>
              <span className="px-4">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 py-1"
              >
                +
              </button>
            </div>

            <button
              onClick={() => addItem(item, qty)}
              disabled={!item.isAvailable}
              className={`px-5 py-2 rounded-lg font-semibold ${
                item.isAvailable
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {item.isAvailable ? `Add to Cart · $${(item.price * qty).toFixed(2)}` : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}