import { useEffect, useState } from 'react';
import { getMenuItems, adminToggleAvailability } from '../services/endpoints';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function AdminMenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    setLoading(true);
    getMenuItems()
      .then((res) => setItems(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleToggle = async (id) => {
    try {
      await adminToggleAvailability(id);
      toast.success('Availability updated');
      fetchItems();
    } catch {
      toast.error('Failed to toggle availability');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-charcoal text-white py-6">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <h1 className="font-display text-2xl font-bold">📋 Menu & Availability</h1>
          <Link to="/admin/orders" className="text-secondary hover:text-white transition-colors font-semibold">
            ← Back to Orders
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={`card p-4 flex items-center justify-between ${
                  !item.isAvailable ? 'opacity-60 bg-gray-50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">🍛</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-slate">{item.category} · ${Number(item.price).toFixed(2)} · {item.portionSize}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {item.isSpicy && <span className="spicy-badge text-[10px]">🌶️</span>}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.isAvailable}
                      onChange={() => handleToggle(item.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-pure-veg transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    <span className="ml-2 text-xs font-semibold">
                      {item.isAvailable ? 'Available' : 'OOS'}
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
