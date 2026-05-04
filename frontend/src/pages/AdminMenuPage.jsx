import { useEffect, useState } from 'react';
import { getMenuItems, getCategories, adminToggleAvailability, adminCreateMenuItem } from '../services/endpoints';
import toast from 'react-hot-toast';
import AdminNavbar from '../components/layout/AdminNavbar';

export default function AdminMenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    portionSize: '',
    imageUrl: '',
    isAvailable: 'true',
    isSpicy: 'false',
    heritageNote: '',
    displayOrder: '',
  });

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data)).catch(() => {});
    fetchItems();
  }, []);

  const fetchItems = () => {
    setLoading(true);
    getMenuItems()
      .then((res) => setItems(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleToggle = async (id) => {
    try {
      await adminToggleAvailability(id);
      toast.success('Availability updated');
      fetchItems();
    } catch {
      toast.error('Failed to toggle availability');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        price: Number(form.price),
        portionSize: form.portionSize.trim(),
        imageUrl: form.imageUrl.trim(),
        isAvailable: form.isAvailable === 'true',
        isSpicy: form.isSpicy === 'true',
        heritageNote: form.heritageNote.trim(),
        displayOrder: Number(form.displayOrder),
      };
      await adminCreateMenuItem(payload);
      toast.success('Menu item created');
      setForm({
        name: '',
        description: '',
        category: '',
        price: '',
        portionSize: '',
        imageUrl: '',
        isAvailable: 'true',
        isSpicy: 'false',
        heritageNote: '',
        displayOrder: '',
      });
      setShowForm(false);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create item');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar title="Menu & Availability" subtitle="Add, update, and manage products" />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="section-title text-2xl">Menu Items</h2>
            <p className="text-slate text-sm">Create and manage your menu</p>
          </div>
          <button type="button" className="btn-primary" onClick={() => setShowForm(true)}>
            Add
          </button>
        </div>

        {showForm && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-md px-4 py-10"
            onClick={() => setShowForm(false)}
          >
            <div
              className="card w-full max-w-3xl p-6 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Add New Product</h2>
                <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>
                  Close
                </button>
              </div>
              <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                maxLength={100}
                placeholder="Butter Chicken"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
                className="input-field"
              >
                <option value="" disabled>Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Price ($)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                placeholder="12.99"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Portion Size</label>
              <input
                type="text"
                value={form.portionSize}
                onChange={(e) => setForm({ ...form, portionSize: e.target.value })}
                required
                placeholder="1 plate"
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-charcoal mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                required
                maxLength={500}
                placeholder="Creamy tomato gravy with tender chicken pieces."
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-charcoal mb-1">Image URL</label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                required
                placeholder="https://..."
                className="input-field"
              />
              <p className="text-xs text-slate mt-1">Use a public image URL (JPG/PNG) for best results.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Heritage Note</label>
              <input
                type="text"
                value={form.heritageNote}
                onChange={(e) => setForm({ ...form, heritageNote: e.target.value })}
                required
                placeholder="North Indian classic"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Display Order</label>
              <input
                type="number"
                min="0"
                value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
                required
                placeholder="0"
                className="input-field"
              />
              <p className="text-xs text-slate mt-1">Lower numbers appear first.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Available</label>
              <select
                value={form.isAvailable}
                onChange={(e) => setForm({ ...form, isAvailable: e.target.value })}
                required
                className="input-field"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Spicy</label>
              <select
                value={form.isSpicy}
                onChange={(e) => setForm({ ...form, isSpicy: e.target.value })}
                required
                className="input-field"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <button type="submit" disabled={creating} className="btn-primary w-full disabled:opacity-50">
                {creating ? 'Creating...' : 'Add Product'}
              </button>
            </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={`card p-4 flex items-center justify-between ${
                  !item.isAvailable ? 'opacity-60 bg-gray-50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-slate">{item.category} · ${Number(item.price).toFixed(2)} · {item.portionSize}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {item.isSpicy && <span className="spicy-badge text-[10px]">Spicy</span>}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.isAvailable}
                      onChange={() => handleToggle(item.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-pure-veg transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    <span className="ml-2 text-xs font-semibold">
                      {item.isAvailable ? 'Available' : 'OOS'}
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
