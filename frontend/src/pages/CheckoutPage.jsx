import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/endpoints';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        orderType: 'INDIVIDUAL',
        items: items.map((i) => ({
          menuItemId: i.menuItemId,
          quantity: i.quantity,
        })),
        specialInstructions: specialInstructions || null,
      };

      const res = await placeOrder(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${res.data.id}`);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to place order';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>

        {/* Customer Info */}
        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate mb-1">Name</label>
              <input type="text" value={user?.name || ''} disabled className="input-field bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm text-slate mb-1">Phone</label>
              <input type="text" value={user?.phoneNumber || ''} disabled className="input-field bg-gray-50" />
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="divide-y">
            {items.map((item) => (
              <div key={item.menuItemId} className="py-3 flex justify-between">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-slate ml-2">× {item.quantity}</span>
                </div>
                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 mt-3 flex justify-between">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold text-primary">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Special Instructions */}
        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Special Instructions</h2>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Any dietary needs, allergies, or special requests..."
            rows={3}
            className="input-field resize-none"
          />
        </div>

        {/* Pay at Pickup Notice */}
        <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-6 mb-6 text-center">
          <p className="text-xl font-bold text-secondary mb-2">💵 Pay at Pickup</p>
          <p className="text-slate">No online payment required. Pay when you pick up your order.</p>
        </div>

        {/* Place Order */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading || items.length === 0}
          className="btn-primary w-full text-lg py-4 disabled:opacity-50"
        >
          {loading ? 'Placing Order...' : `Place Order — $${totalAmount.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
