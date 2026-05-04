import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMyOrder } from '../services/endpoints';
import { FiCheckCircle } from 'react-icons/fi';
import OrderStatusStepper from '../components/orders/OrderStatusStepper';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getMyOrder(id).then((res) => setOrder(res.data)).catch(() => {});
  }, [id]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <FiCheckCircle className="w-16 h-16 mx-auto mb-6 text-pure-veg" />
        <h1 className="font-display text-4xl font-bold text-primary mb-2">Order Status</h1>
        <p className="text-slate text-lg mb-8">
          Your order <span className="font-bold text-charcoal">{order.orderNumber}</span> has been received.
        </p>

        <div className="card p-6 mb-8 text-left">
          <h2 className="font-semibold text-lg mb-4">Current Status</h2>
          <OrderStatusStepper status={order.status} orderType={order.orderType} />
          {order.estimatedReadyTime && (
            <p className="text-sm text-secondary mt-4 text-center">
              Estimated ready: {new Date(order.estimatedReadyTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </p>
          )}
        </div>

        <div className="card p-6 mb-8 text-left">
          <div className="divide-y">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex justify-between">
                <div>
                  <span className="font-medium">{item.menuItemName}</span>
                  <span className="text-slate ml-2">× {item.quantity}</span>
                </div>
                <span className="font-semibold">${Number(item.subtotal).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mt-4 flex justify-between">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold text-primary">${Number(order.totalAmount).toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-4 mb-8">
          <p className="font-semibold text-secondary">Pay at Pickup</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard" className="btn-primary">Track My Orders</Link>
          <Link to="/menu" className="btn-outline">Order More</Link>
        </div>
      </div>
    </div>
  );
}
