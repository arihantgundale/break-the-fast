import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendOtp, verifyOtp, adminLogin } from '../services/endpoints';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { loginCustomer, loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  // Customer OTP flow
  const [phone, setPhone] = useState('+1');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  // Admin flow
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ─── Customer: Send OTP ─────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendOtp(phone);
      setOtpSent(true);
      toast.success('OTP sent to your phone!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // ─── Customer: Verify OTP ───
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await verifyOtp(phone, otp);
      loginCustomer(res.data);
      toast.success('Welcome to Break The Fast!');
      if (res.data.newUser) {
        navigate('/dashboard/profile');
      } else {
        navigate('/menu');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // ─── Admin Login ────────────
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminLogin(email, password);
      loginAdmin(res.data);
      toast.success('Admin login successful');
      navigate('/admin/orders');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

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
            onClick={() => setIsAdmin(false)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              !isAdmin ? 'bg-primary text-white' : 'bg-white text-slate'
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => setIsAdmin(true)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              isAdmin ? 'bg-primary text-white' : 'bg-white text-slate'
            }`}
          >
            Admin
          </button>
        </div>

        <div className="card p-8">
          {isAdmin ? (
            // ─── Admin Login Form ──────
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@breakthefast.com"
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-field"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign In as Admin'}
              </button>
            </form>
          ) : !otpSent ? (
            // ─── Phone Number Form ─────
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1XXXXXXXXXX"
                  required
                  className="input-field text-lg"
                />
                <p className="text-xs text-gray-400 mt-1">US phone number in format +1XXXXXXXXXX</p>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Sending OTP...' : 'Send Verification Code'}
              </button>
            </form>
          ) : (
            // ─── OTP Verification Form ──
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-sm text-slate">
                We sent a 6-digit code to <span className="font-semibold text-charcoal">{phone}</span>
              </p>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  required
                  className="input-field text-center text-2xl tracking-[0.5em] font-bold"
                />
              </div>
              <button type="submit" disabled={loading || otp.length < 6} className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </button>
              <button
                type="button"
                onClick={() => { setOtpSent(false); setOtp(''); }}
                className="text-sm text-slate hover:text-primary w-full"
              >
                ← Change phone number
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
