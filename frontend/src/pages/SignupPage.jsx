import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendSignupOtp, verifySignupOtp } from '../services/endpoints';
import toast from 'react-hot-toast';

const PHONE_RE = /^\+1\d{10}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const { loginCustomer } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', phoneNumber: '+1', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const setField = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: '' }));
  };

  const validateForm = () => {
    const errs = {};
    if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!PHONE_RE.test(form.phoneNumber)) errs.phoneNumber = 'Enter a valid US number: +1 followed by 10 digits';
    if (!EMAIL_RE.test(form.email)) errs.email = 'Enter a valid email address';
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    return errs;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
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
      const res = await verifySignupOtp({ ...form, otpCode: otp });
      loginCustomer(res.data);
      toast.success('Account created!');
      navigate('/menu');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid OTP');
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
          <h1 className="font-display text-4xl font-bold text-primary">Create Account</h1>
          <p className="text-slate mt-2">Sign up to place your order</p>
        </div>

        <div className="card p-8">
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  placeholder="Your name"
                  className={inputCls('name')}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(e) => setField('phoneNumber', e.target.value)}
                  placeholder="+1XXXXXXXXXX"
                  className={inputCls('phoneNumber')}
                />
                {errors.phoneNumber
                  ? <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
                  : <p className="text-xs text-gray-400 mt-1">US phone number: +1 followed by 10 digits</p>
                }
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  placeholder="you@email.com"
                  className={inputCls('email')}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setField('password', e.target.value)}
                  placeholder="••••••••"
                  className={inputCls('password')}
                />
                {errors.password
                  ? <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  : <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
                }
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
                {otp.length > 0 && otp.length < 6 && (
                  <p className="text-red-500 text-xs mt-1">Enter all 6 digits</p>
                )}
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
