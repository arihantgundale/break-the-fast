import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { customerLogin, adminLogin } from '../services/endpoints';
import toast from 'react-hot-toast';

const PHONE_RE = /^\+1\d{10}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const { loginCustomer, loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const [phone, setPhone] = useState('+1');
  const [customerPassword, setCustomerPassword] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!PHONE_RE.test(phone)) errs.phone = 'Enter a valid US number: +1 followed by 10 digits';
    if (!customerPassword) errs.customerPassword = 'Password is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await customerLogin(phone, customerPassword);
      loginCustomer(res.data);
      toast.success('Welcome back!');
      navigate('/menu');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!EMAIL_RE.test(email)) errs.email = 'Enter a valid email address';
    if (!password) errs.password = 'Password is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await adminLogin(email, password);
      loginAdmin(res.data);
      toast.success('Admin login successful');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (field) =>
    `input-field ${errors[field] ? 'border-red-500 focus:ring-red-500' : ''}`;

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-primary">Break The Fast</h1>
          <p className="text-slate mt-2">Sign in to place your order</p>
        </div>

        {/* Toggle Customer / Admin */}
        <div className="flex rounded-lg overflow-hidden mb-6 border border-gray-200">
          <button
            onClick={() => { setIsAdmin(false); setErrors({}); }}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              !isAdmin ? 'bg-primary text-white' : 'bg-white text-slate'
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => { setIsAdmin(true); setErrors({}); }}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              isAdmin ? 'bg-primary text-white' : 'bg-white text-slate'
            }`}
          >
            Admin
          </button>
        </div>

        <div className="card p-8">
          {isAdmin ? (
            <form onSubmit={handleAdminLogin} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
                  placeholder="admin@breakthefast.com"
                  className={inputCls('email')}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
                  placeholder="••••••••"
                  className={inputCls('password')}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign In as Admin'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCustomerLogin} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: '' })); }}
                  placeholder="+1XXXXXXXXXX"
                  className={inputCls('phone')}
                />
                {errors.phone
                  ? <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  : <p className="text-xs text-gray-400 mt-1">US phone number: +1 followed by 10 digits</p>
                }
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Password</label>
                <input
                  type="password"
                  value={customerPassword}
                  onChange={(e) => { setCustomerPassword(e.target.value); setErrors((p) => ({ ...p, customerPassword: '' })); }}
                  placeholder="••••••••"
                  className={inputCls('customerPassword')}
                />
                {errors.customerPassword && <p className="text-red-500 text-xs mt-1">{errors.customerPassword}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              <p className="text-sm text-slate text-center">
                New here? <Link to="/signup" className="text-primary font-semibold">Create an account</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
