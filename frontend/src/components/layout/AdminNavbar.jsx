import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminNavbar({ title, subtitle }) {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="bg-charcoal text-white py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-gray-300 text-sm">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/admin/dashboard" className="bg-white text-charcoal px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100">
            Dashboard
          </Link>
          <Link to="/admin/orders" className="bg-white text-charcoal px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100">
            Order Management
          </Link>
          <Link to="/admin/menu" className="bg-secondary text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-secondary-dark">
            Menu
          </Link>
          <Link to="/admin/quick-entry" className="bg-secondary text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-secondary-dark">
            Quick Entry
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
