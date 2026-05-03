import { useEffect, useMemo, useState } from 'react';
import { adminGetDashboard } from '../services/endpoints';
import toast from 'react-hot-toast';
import AdminNavbar from '../components/layout/AdminNavbar';

const RANGE_LABELS = {
  weekly: 'Last 7 Days',
  monthly: 'Last 30 Days',
};

export default function AdminDashboardPage() {
  const [range, setRange] = useState('weekly');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminGetDashboard(range)
      .then((res) => setData(res.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, [range]);

  const chartMaxOrders = useMemo(() => {
    if (!data?.ordersSeries?.length) return 1;
    return Math.max(...data.ordersSeries, 1);
  }, [data]);

  const chartMaxRevenue = useMemo(() => {
    if (!data?.revenueSeries?.length) return 1;
    return Math.max(...data.revenueSeries.map((v) => Number(v)), 1);
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar title="Admin Dashboard" subtitle="Orders and revenue insights" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-3 mb-6">
          {['weekly', 'monthly'].map((key) => (
            <button
              key={key}
              onClick={() => setRange(key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                range === key ? 'bg-primary text-white border-primary' : 'bg-white text-slate border-gray-300'
              }`}
            >
              {RANGE_LABELS[key]}
            </button>
          ))}
        </div>

        {loading || !data ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="card p-5">
                <p className="text-xs uppercase text-slate">Total Orders</p>
                <p className="text-3xl font-bold text-charcoal mt-1">{data.totalOrders}</p>
                <p className="text-xs text-slate mt-2">{RANGE_LABELS[range]}</p>
              </div>
              <div className="card p-5">
                <p className="text-xs uppercase text-slate">Total Customers</p>
                <p className="text-3xl font-bold text-charcoal mt-1">{data.totalCustomers}</p>
                <p className="text-xs text-slate mt-2">All time</p>
              </div>
              <div className="card p-5">
                <p className="text-xs uppercase text-slate">Total Revenue</p>
                <p className="text-3xl font-bold text-charcoal mt-1">${Number(data.totalRevenue).toFixed(2)}</p>
                <p className="text-xs text-slate mt-2">{RANGE_LABELS[range]}</p>
              </div>
              <div className="card p-5">
                <p className="text-xs uppercase text-slate">Avg Order Value</p>
                <p className="text-3xl font-bold text-charcoal mt-1">${Number(data.averageOrderValue).toFixed(2)}</p>
                <p className="text-xs text-slate mt-2">{RANGE_LABELS[range]}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg">Orders</h2>
                  <span className="text-xs text-slate">{RANGE_LABELS[range]}</span>
                </div>
                <div className="h-56 flex items-end gap-2">
                  {data.ordersSeries.map((value, idx) => (
                    <div key={data.labels[idx]} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden flex items-end">
                        <div
                          className="bg-primary w-full rounded-lg"
                          style={{ height: `${Math.max(6, (value / chartMaxOrders) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-slate">
                        {new Date(data.labels[idx]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg">Revenue</h2>
                  <span className="text-xs text-slate">{RANGE_LABELS[range]}</span>
                </div>
                <div className="h-56 flex items-end gap-2">
                  {data.revenueSeries.map((value, idx) => (
                    <div key={data.labels[idx]} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden flex items-end">
                        <div
                          className="bg-secondary w-full rounded-lg"
                          style={{ height: `${Math.max(6, (Number(value) / chartMaxRevenue) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-slate">
                        {new Date(data.labels[idx]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Top Products</h2>
                <span className="text-xs text-slate">By quantity · {RANGE_LABELS[range]}</span>
              </div>
              {!data.topProducts || data.topProducts.length === 0 ? (
                <p className="text-sm text-slate">No product data for this range.</p>
              ) : (
                <div className="divide-y">
                  {data.topProducts.map((item, idx) => (
                    <div key={item.menuItemId} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-gray-100 text-slate px-2 py-1 rounded-full">#{idx + 1}</span>
                        <div>
                          <p className="font-semibold text-charcoal">{item.name}</p>
                          <p className="text-xs text-slate">{item.totalQuantity} sold</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-primary">${Number(item.totalRevenue).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
