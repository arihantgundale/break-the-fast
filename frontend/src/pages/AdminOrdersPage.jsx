import { useEffect, useState, useCallback } from 'react';
import { adminGetOrders, adminGetSummary, adminUpdateStatus, adminCancelOrder } from '../services/endpoints';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FiPhone, FiGlobe, FiClock, FiFilter } from 'react-icons/fi';

const STATUS_COLORS = {
  RECEIVED: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-yellow-100 text-yellow-700',
  READY_FOR_PICKUP: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-700',
};

const NEXT_STATUS = {
  RECEIVED: 'PREPARING',
  PREPARING: 'READY_FOR_PICKUP',
  READY_FOR_PICKUP: 'COMPLETED',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filter, setFilter] = useState({ status: null, orderType: null, orderSource: null });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    const params = { page, size: 20, ...filter };
    Object.keys(params).forEach((k) => params[k] == null && delete params[k]);
    adminGetOrders(params)
      .then((res) => { setOrders(res.data.data); setTotalPages(res.data.totalPages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, filter]);

  const fetchSummary = () => {
    adminGetSummary().then((res) => setSummary(res.data)).catch(() => {});
  };

  useEffect(() => { fetchOrders(); fetchSummary(); }, [fetchOrders]);

  const handleAdvanceStatus = async (orderId, currentStatus) => {
    const nextStatus = NEXT_STATUS[currentStatus];
    if (!nextStatus) return;
    try {
      await adminUpdateStatus(orderId, { status: nextStatus });
      toast.success(`Order moved to ${nextStatus}`);
      fetchOrders();
      fetchSummary();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update');
    }
  };

  const handleCancel = async (orderId) => {
    const reason = prompt('Enter cancellation reason:');
    if (!reason) return;
    try {
      await adminCancelOrder(orderId, reason);
      toast.success('Order cancelled');
      fetchOrders();
      fetchSummary();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to cancel');
    }
  };

  const timeSince = (date) => {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-charcoal text-white py-6">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <h1 className="font-display text-2xl font-bold">🍽️ Command Center</h1>
          <div className="flex gap-4">
            <Link to="/admin/quick-entry" className="bg-secondary text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-secondary-dark">
              + Quick Entry
            </Link>
            <Link to="/admin/menu" className="bg-white text-charcoal px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100">
              Menu Management
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Summary Bar */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {Object.entries(summary.statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setFilter({ ...filter, status: filter.status === status ? null : status })}
                className={`p-4 rounded-xl text-center transition-all ${
                  filter.status === status ? 'ring-2 ring-primary' : ''
                } ${STATUS_COLORS[status]}`}
              >
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs font-medium">{status.replace(/_/g, ' ')}</p>
              </button>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <FiFilter className="self-center text-slate" />
          {['INDIVIDUAL', 'CATERING'].map((t) => (
            <button key={t} onClick={() => setFilter({ ...filter, orderType: filter.orderType === t ? null : t })}
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                filter.orderType === t ? 'bg-primary text-white border-primary' : 'border-gray-300 text-slate'
              }`}>
              {t}
            </button>
          ))}
          {['WEB', 'PHONE'].map((s) => (
            <button key={s} onClick={() => setFilter({ ...filter, orderSource: filter.orderSource === s ? null : s })}
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                filter.orderSource === s ? 'bg-primary text-white border-primary' : 'border-gray-300 text-slate'
              }`}>
              {s === 'WEB' ? '🌐 Web' : '📞 Phone'}
            </button>
          ))}
        </div>

        {/* Orders Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {orders.map((order) => (
              <div key={order.id} className={`card p-5 ${order.orderType === 'CATERING' ? 'border-l-4 border-secondary' : ''}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{order.orderNumber}</h3>
                      {order.orderSource === 'PHONE' && (
                        <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          <FiPhone className="inline w-3 h-3" /> PHONE
                        </span>
                      )}
                      {order.orderSource === 'WEB' && (
                        <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          <FiGlobe className="inline w-3 h-3" /> WEB
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate">{order.customerName} · {order.customerPhone}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.status]}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Items */}
                <div className="text-sm text-slate mb-3">
                  {order.items.map((item) => (
                    <span key={item.id} className="block">{item.menuItemName} × {item.quantity} — ${Number(item.subtotal).toFixed(2)}</span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="flex items-center gap-1 text-gray-400"><FiClock className="w-4 h-4" /> {timeSince(order.createdAt)}</span>
                  <span className="font-bold text-primary">${Number(order.totalAmount).toFixed(2)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {NEXT_STATUS[order.status] && (
                    <button
                      onClick={() => handleAdvanceStatus(order.id, order.status)}
                      className="flex-1 bg-pure-veg text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors"
                    >
                      → {NEXT_STATUS[order.status].replace(/_/g, ' ')}
                    </button>
                  )}
                  {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      className="px-3 py-2 rounded-lg text-sm font-semibold text-red-500 border border-red-200 hover:bg-red-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-8">
            <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
              className="btn-outline text-sm py-2 px-4 disabled:opacity-30">Previous</button>
            <span className="text-slate self-center">Page {page + 1} of {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
              className="btn-outline text-sm py-2 px-4 disabled:opacity-30">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
