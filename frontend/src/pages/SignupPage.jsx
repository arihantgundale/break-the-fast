import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendSignupOtp, verifySignupOtp } from '../services/endpoints';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const { loginCustomer } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phoneNumber: '+1',
    email: '',
    password: '',
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendSignupOtp(form.phoneNumber);
      setOtpSent(true);
      toast.success('OTP sent to your phone!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, otpCode: otp };
      const res = await verifySignupOtp(payload);
      loginCustomer(res.data);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-primary">Create Account</h1>
          <p className="text-slate mt-2">Sign up to place your order</p>
        </div>

        <div className="card p-8">
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  placeholder="+1XXXXXXXXXX"
                  required
                  className="input-field"
                />
                <p className="text-xs text-gray-400 mt-1">US phone number in format +1XXXXXXXXXX</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@email.com"
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="input-field"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Sending OTP...' : 'Send Verification Code'}
              </button>
              <p className="text-sm text-slate text-center">
                Already have an account? <Link to="/login" className="text-primary font-semibold">Sign In</Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-sm text-slate">
                We sent a 6-digit code to <span className="font-semibold text-charcoal">{form.phoneNumber}</span>
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
                {loading ? 'Verifying...' : 'Verify & Create Account'}
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
