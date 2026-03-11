import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/endpoints';
import OrderStatusStepper from '../components/orders/OrderStatusStepper';

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = () => {
    setLoading(true);
    getMyOrders(page, 10)
      .then((res) => {
        setOrders(res.data.data);
        setTotalPages(res.data.totalPages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-3xl font-bold">My Orders</h1>
          <Link to="/dashboard/profile" className="btn-outline text-sm py-2 px-4">Edit Profile</Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📋</p>
            <h2 className="font-display text-xl font-bold mb-2">No orders yet</h2>
            <Link to="/menu" className="btn-primary mt-4 inline-block">Browse Menu</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                    <p className="text-sm text-slate">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className="text-primary font-bold text-lg">${Number(order.totalAmount).toFixed(2)}</span>
                </div>

                <OrderStatusStepper status={order.status} />

                {order.estimatedReadyTime && (
                  <p className="text-sm text-secondary mt-3 text-center">
                    ⏰ Estimated ready: {new Date(order.estimatedReadyTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                )}

                <div className="mt-4 text-sm text-slate">
                  {order.items.slice(0, 3).map((item) => (
                    <span key={item.id} className="mr-3">{item.menuItemName} ×{item.quantity}</span>
                  ))}
                  {order.items.length > 3 && <span>+{order.items.length - 3} more</span>}
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="btn-outline text-sm py-2 px-4 disabled:opacity-30"
                >
                  Previous
                </button>
                <span className="text-slate self-center">Page {page + 1} of {totalPages}</span>
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="btn-outline text-sm py-2 px-4 disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
