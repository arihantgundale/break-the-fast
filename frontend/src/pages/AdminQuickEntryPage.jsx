import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMenuItems, adminQuickEntry } from '../services/endpoints';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminQuickEntryPage() {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [phone, setPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [cart, setCart] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    getMenuItems().then((res) => setMenuItems(res.data.filter((i) => i.isAvailable)));
  }, []);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === item.id);
      if (existing) {
        return prev.map((c) => (c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { menuItemId: item.id, quantity: 1, name: item.name, price: item.price }];
    });
  };

  const updateQuantity = (menuItemId, delta) => {
    setCart((prev) =>
      prev
        .map((c) => (c.menuItemId === menuItemId ? { ...c, quantity: c.quantity + delta } : c))
        .filter((c) => c.quantity > 0)
    );
  };

  const total = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || cart.length === 0) {
      toast.error('Phone and at least one item are required');
      return;
    }
    setLoading(true);
    try {
      const body = {
        customerPhone: phone.startsWith('+1') ? phone : `+1${phone.replace(/\D/g, '')}`,
        customerName: customerName || undefined,
        items: cart.map(({ menuItemId, quantity }) => ({ menuItemId, quantity })),
        specialInstructions: specialInstructions || undefined,
      };
      const res = await adminQuickEntry(body);
      setSuccess(res.data);
      toast.success(`Order ${res.data.orderNumber} created!`);
      setCart([]);
      setPhone('');
      setCustomerName('');
      setSpecialInstructions('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-charcoal text-white py-6">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <h1 className="font-display text-2xl font-bold">📞 Quick Phone-Order Entry</h1>
          <Link to="/admin/orders" className="text-secondary hover:text-white transition-colors font-semibold">
            ← Back to Orders
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
        {/* Left – Menu catalogue */}
        <div>
          <h2 className="section-title text-lg mb-4">Menu Items</h2>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="w-full text-left card p-3 flex justify-between items-center hover:border-primary transition-colors"
              >
                <div>
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-sm text-slate ml-2">{item.category}</span>
                </div>
                <span className="text-primary font-bold">${Number(item.price).toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right – Order form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="section-title text-lg">Customer Info</h2>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Customer Name (optional)</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Walk-in customer name"
                className="input-field"
              />
            </div>
          </div>

          <div className="card p-6 space-y-3">
            <h2 className="section-title text-lg">Order Items ({cart.length})</h2>
            {cart.length === 0 ? (
              <p className="text-slate text-sm">Click items on the left to add them</p>
            ) : (
              cart.map((c) => (
                <div key={c.menuItemId} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="font-medium">{c.name}</span>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => updateQuantity(c.menuItemId, -1)} className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center font-bold">−</button>
                    <span className="w-6 text-center font-semibold">{c.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(c.menuItemId, 1)} className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center font-bold">+</button>
                    <span className="w-20 text-right text-primary font-bold">${(c.price * c.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
            {cart.length > 0 && (
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Special Instructions</label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
              className="input-field"
              placeholder="E.g. Extra spicy, no onion..."
            />
          </div>

          <button
            type="submit"
            disabled={loading || cart.length === 0}
            className="btn-primary w-full text-lg py-3 disabled:opacity-50"
          >
            {loading ? 'Creating Order…' : `Place Order · $${total.toFixed(2)}`}
          </button>

          {success && (
            <div className="card p-4 bg-green-50 border-green-200 text-center">
              <p className="text-green-700 font-bold text-lg">✅ {success.orderNumber}</p>
              <p className="text-sm text-slate">Created • Estimated pickup: {success.estimatedPickupTime || '—'}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
