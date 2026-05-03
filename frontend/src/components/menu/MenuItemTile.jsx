import { useState } from 'react';

export default function MenuItemTile({ item, onSelect }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="card group cursor-pointer hover:-translate-y-0.5 transition-transform"
      onClick={() => onSelect(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(item);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {item.imageUrl && !imgError ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
            <span className="text-xs text-gray-400 font-medium">{item.name}</span>
          </div>
        )}
        {item.isSpicy && (
          <div className="absolute top-3 left-3">
            <span className="spicy-badge">Spicy</span>
          </div>
        )}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg bg-red-600 px-4 py-2 rounded">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-charcoal">{item.name}</h3>
          <span className="text-primary font-bold text-lg">${Number(item.price).toFixed(2)}</span>
        </div>
        <p className="text-slate text-sm mb-2 line-clamp-2">{item.description}</p>
        {item.portionSize && (
          <p className="text-xs text-gray-400">{item.portionSize}</p>
        )}
      </div>
    </div>
  );
}
