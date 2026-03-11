import { useEffect, useState } from 'react';
import { getMenuItems, getCategories, searchMenu } from '../services/endpoints';
import MenuItemCard from '../components/menu/MenuItemCard';
import { FiSearch } from 'react-icons/fi';

const CATEGORY_LABELS = {
  BREAKFAST: '🌅 Breakfast',
  LUNCH_THALI: '🍛 Lunch Thali',
  SNACKS_CHAAT: '🥟 Snacks & Chaat',
  SWEETS_DESSERTS: '🍮 Sweets & Desserts',
  DINNER: '🌙 Dinner',
  CATERING: '🎉 Catering Platters',
};

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data)).catch(() => {});
    fetchItems();
  }, []);

  const fetchItems = (category) => {
    setLoading(true);
    getMenuItems(category)
      .then((res) => setItems(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleCategoryClick = (cat) => {
    if (activeCategory === cat) {
      setActiveCategory(null);
      fetchItems();
    } else {
      setActiveCategory(cat);
      fetchItems(cat);
    }
    setSearchQuery('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchItems(activeCategory);
      return;
    }
    setLoading(true);
    setActiveCategory(null);
    searchMenu(searchQuery)
      .then((res) => setItems(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-center">Our Menu</h1>
          <p className="text-center text-gray-200 mt-2">Authentic flavors, handcrafted with tradition</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes..."
              className="input-field pl-12"
            />
          </div>
        </form>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-slate border border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              {CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate">Loading menu...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-slate">
            <p className="text-xl">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
