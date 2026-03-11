import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/endpoints';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { setUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', whatsappOptIn: true, emailOptIn: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProfile().then((res) => {
      setForm({
        name: res.data.name || '',
        email: res.data.email || '',
        whatsappOptIn: res.data.whatsappOptIn,
        emailOptIn: res.data.emailOptIn,
      });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile(form);
      setUser(res.data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-xl mx-auto px-4">
        <h1 className="font-display text-3xl font-bold mb-8">My Profile</h1>

        <form onSubmit={handleSubmit} className="card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email (optional, for notifications)</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com"
              className="input-field"
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Notification Preferences</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.whatsappOptIn}
                onChange={(e) => setForm({ ...form, whatsappOptIn: e.target.checked })}
                className="w-5 h-5 text-primary rounded"
              />
              <span>WhatsApp notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.emailOptIn}
                onChange={(e) => setForm({ ...form, emailOptIn: e.target.checked })}
                className="w-5 h-5 text-primary rounded"
              />
              <span>Email notifications</span>
            </label>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
