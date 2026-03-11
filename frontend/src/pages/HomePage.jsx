import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMenuItems } from '../services/endpoints';
import MenuItemCard from '../components/menu/MenuItemCard';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getMenuItems()
      .then((res) => setFeatured(res.data.slice(0, 6)))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-charcoal text-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="pure-veg-badge mx-auto mb-6 text-sm">🌿 100% Pure Vegetarian</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Break The Fast
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-8 font-light">
            Authentic Indian Cuisine — Where Heritage Meets Every Bite
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu" className="btn-secondary text-lg px-8 py-4">
              Explore Our Menu
            </Link>
            <Link to="/catering" className="btn-outline border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4">
              Catering Services
            </Link>
          </div>
          <p className="mt-6 text-secondary font-semibold text-sm tracking-wide uppercase">
            📍 Pickup Only — Pay at Pickup
          </p>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-4">Our Heritage</h2>
          <p className="text-center text-slate max-w-3xl mx-auto mb-12 text-lg">
            Discover the stories behind India's timeless culinary traditions
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">🍃</div>
              <h3 className="font-display text-xl font-bold mb-2">Pure Vegetarian Philosophy</h3>
              <p className="text-slate text-sm">
                Indian vegetarian cooking is rooted in Ahimsa — the principle of non-violence. Every dish celebrates life through plant-based ingredients.
              </p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">🌶️</div>
              <h3 className="font-display text-xl font-bold mb-2">The Story of Spices</h3>
              <p className="text-slate text-sm">
                From turmeric's healing powers to cardamom's royal aroma — Indian spices have shaped world trade routes and Ayurvedic food science.
              </p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">🍛</div>
              <h3 className="font-display text-xl font-bold mb-2">Regional Traditions</h3>
              <p className="text-slate text-sm">
                From Punjab's hearty thalis to Tamil Nadu's dosa culture and Gujarat's sweet-savory symphony — every region tells a unique culinary story.
              </p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">👨‍🍳</div>
              <h3 className="font-display text-xl font-bold mb-2">Our Story</h3>
              <p className="text-slate text-sm">
                Founded with a passion to bring authentic Indian flavors to the US, we honor traditional recipes passed down through generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-4">Signature Dishes</h2>
          <p className="text-center text-slate max-w-2xl mx-auto mb-12">
            A taste of what awaits you — handcrafted with authentic spices and love
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/menu" className="btn-primary text-lg px-8">View Full Menu</Link>
          </div>
        </div>
      </section>

      {/* Location / Map Section */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title mb-4">Visit Us</h2>
          <p className="text-slate mb-8">
            📍 123 Spice Lane, City, ST 12345 | ☎️ (555) 123-4567
          </p>
          <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center text-slate">
            <p>🗺️ Google Maps Embed — Configure with your API key</p>
          </div>
          <p className="mt-4 text-secondary font-semibold">Pickup Only — Pay When You Arrive</p>
        </div>
      </section>
    </div>
  );
}
