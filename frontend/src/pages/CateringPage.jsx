import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCheck, FiPlus, FiMinus } from 'react-icons/fi';
import { getMenuItems, placeOrder } from '../services/endpoints';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function CateringPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState({});
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getMenuItems('CATERING')
      .then((res) => setMenuItems(res.data))
      .catch(() => toast.error('Failed to load catering items'))
      .finally(() => setLoading(false));
  }, []);

  const updateQty = (id, delta) => {
    setCart((prev) => {
      const next = (prev[id] || 0) + delta;
      if (next <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const selectedItems = menuItems.filter((i) => cart[i.id]);
  const totalAmount = selectedItems.reduce((sum, i) => sum + i.price * (cart[i.id] || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to place a catering order');
      navigate('/login');
      return;
    }
    if (selectedItems.length === 0) {
      toast.error('Select at least one item');
      return;
    }
    setSubmitting(true);
    try {
      const res = await placeOrder({
        orderType: 'CATERING',
        items: Object.entries(cart).map(([menuItemId, quantity]) => ({ menuItemId, quantity })),
        eventDate,
        guestCount: Number(guestCount),
        specialInstructions: specialInstructions || undefined,
      });
      toast.success('Catering order placed!');
      navigate(`/order-confirmation/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-charcoal text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Catering & Event Platters</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Bring the taste of India to your next gathering. Perfect for office breakfasts,
            community events, festivals, and family celebrations.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* Left: Item Selection */}
          <div className="lg:col-span-2">
            <h2 className="section-title mb-6">Select Your Items</h2>

            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
              </div>
            ) : menuItems.length === 0 ? (
              <div className="card p-8 text-center text-slate">
                <p className="text-lg font-semibold mb-2">No catering items available</p>
                <p className="text-sm">Please check back soon or contact us directly.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className={`card p-4 flex items-center gap-4 transition-all ${
                      cart[item.id] ? 'ring-1 ring-primary' : ''
                    }`}
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-charcoal">{item.name}</h3>
                        {item.isSpicy && (
                          <span className="spicy-badge text-[10px]">Spicy</span>
                        )}
                      </div>
                      <p className="text-sm text-slate line-clamp-1">{item.description}</p>
                      {item.portionSize && (
                        <p className="text-xs text-gray-400 mt-0.5">{item.portionSize}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-primary font-bold">${Number(item.price).toFixed(2)}</span>
                      {cart[item.id] ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, -1)}
                            className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          >
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-semibold">{cart[item.id]}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, 1)}
                            className="w-7 h-7 rounded-full bg-primary text-white hover:bg-primary/90 flex items-center justify-center"
                          >
                            <FiPlus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, 1)}
                          className="w-7 h-7 rounded-full bg-primary text-white hover:bg-primary/90 flex items-center justify-center"
                        >
                          <FiPlus className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Event Details + Order Summary */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="card p-6 space-y-5 sticky top-24">
              <h2 className="font-semibold text-lg text-charcoal">Event Details</h2>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Event Date *</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Number of Guests *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="input-field"
                  placeholder="e.g. 25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Special Instructions</label>
                <textarea
                  rows={3}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="input-field resize-none"
                  placeholder="Dietary preferences, event details..."
                />
              </div>

              {selectedItems.length > 0 && (
                <div className="border-t pt-4 space-y-1">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate truncate mr-2">
                        {item.name} × {cart[item.id]}
                      </span>
                      <span className="font-medium flex-shrink-0">
                        ${(item.price * cart[item.id]).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold pt-2 border-t mt-2">
                    <span>Total</span>
                    <span className="text-primary">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {user ? (
                <button
                  type="submit"
                  disabled={submitting || selectedItems.length === 0}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {submitting ? 'Placing Order...' : 'Place Catering Order'}
                </button>
              ) : (
                <Link to="/login" className="btn-primary w-full text-center block">
                  Sign In to Order
                </Link>
              )}

              <p className="text-xs text-slate text-center">Pay at pickup — no online payment required</p>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
