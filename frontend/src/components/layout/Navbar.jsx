import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';
import { FiMenu, FiX, FiShoppingCart, FiUser } from 'react-icons/fi';

export default function Navbar() {
  const { user, role, logoutUser } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-display font-bold text-primary">Break The Fast</span>
            <span className="pure-veg-badge text-[10px]">🌿 Pure Veg</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/menu" className="text-slate hover:text-primary font-medium transition-colors">Menu</Link>
            <Link to="/catering" className="text-slate hover:text-primary font-medium transition-colors">Catering</Link>
            <Link to="/about" className="text-slate hover:text-primary font-medium transition-colors">About</Link>

            {/* Cart */}
            <Link to="/cart" className="relative text-slate hover:text-primary">
              <FiShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center gap-3">
                {role === 'ADMIN' ? (
                  <Link to="/admin/orders" className="btn-primary text-sm py-2 px-4">Admin Panel</Link>
                ) : (
                  <Link to="/dashboard" className="flex items-center gap-1 text-slate hover:text-primary">
                    <FiUser className="w-5 h-5" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </Link>
                )}
                <button onClick={handleLogout} className="text-sm text-slate hover:text-primary">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2 px-4">Sign In</Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4 space-y-3">
          <Link to="/menu" onClick={() => setMobileOpen(false)} className="block py-2 text-slate hover:text-primary">Menu</Link>
          <Link to="/catering" onClick={() => setMobileOpen(false)} className="block py-2 text-slate hover:text-primary">Catering</Link>
          <Link to="/about" onClick={() => setMobileOpen(false)} className="block py-2 text-slate hover:text-primary">About</Link>
          <Link to="/cart" onClick={() => setMobileOpen(false)} className="block py-2 text-slate hover:text-primary">Cart ({totalItems})</Link>
          {user ? (
            <>
              {role === 'ADMIN' ? (
                <Link to="/admin/orders" onClick={() => setMobileOpen(false)} className="block py-2 text-primary font-medium">Admin Panel</Link>
              ) : (
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block py-2 text-slate">My Orders</Link>
              )}
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block py-2 text-slate">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-primary block text-center">Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
}
