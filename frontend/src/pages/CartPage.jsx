import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiMinus, FiTrash2, FiArrowLeft } from 'react-icons/fi';

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalAmount, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream">
        <p className="text-6xl mb-6">🛒</p>
        <h2 className="font-display text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-slate mb-6">Add some delicious dishes to get started!</p>
        <Link to="/menu" className="btn-primary">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate hover:text-primary mb-6">
          <FiArrowLeft /> Back
        </button>

        <h1 className="font-display text-3xl font-bold mb-8">Your Cart ({totalItems} items)</h1>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div key={item.menuItemId} className="card p-4 flex items-center gap-4">
              {/* Image */}
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">🍛</div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1">
                <h3 className="font-semibold text-charcoal">{item.name}</h3>
                <p className="text-primary font-bold">${Number(item.price).toFixed(2)}</p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:border-primary hover:text-primary"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:border-primary hover:text-primary"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>

              {/* Subtotal */}
              <span className="font-bold text-charcoal w-20 text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </span>

              {/* Remove */}
              <button onClick={() => removeItem(item.menuItemId)} className="text-red-400 hover:text-red-600">
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-primary">${totalAmount.toFixed(2)}</span>
          </div>

          <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4 mb-4 text-center">
            <p className="text-secondary font-semibold">💵 Pay at Pickup — No Online Payment Required</p>
          </div>

          <div className="flex gap-4">
            <button onClick={clearCart} className="btn-outline flex-1">Clear Cart</button>
            {user ? (
              <Link to="/checkout" className="btn-primary flex-1 text-center">Proceed to Checkout</Link>
            ) : (
              <Link to="/login" className="btn-primary flex-1 text-center">Sign In to Order</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
