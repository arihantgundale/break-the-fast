import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMenuItems } from '../services/endpoints';
import MenuItemCard from '../components/menu/MenuItemCard';
import BlobBackground from '../components/home/BlobBackground';
import ShufflingFoodImages from '../components/home/ShufflingFoodImages';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getMenuItems()
      .then((res) => setFeatured(res.data.slice(0, 6)))
      .catch(() => {});
  }, []);

  return (
    <div className="relative">
      {/* Personio-style animated blob background — sits behind everything */}
      <BlobBackground />

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left — Text content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="pure-veg-badge mx-auto lg:mx-0 mb-6 text-sm">🌿 100% Pure Vegetarian</div>
              <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight text-charcoal">
                Break The Fast
              </h1>
              <p className="text-xl md:text-2xl text-slate max-w-2xl mb-8 font-light">
                Authentic Indian Cuisine — Where Heritage Meets Every Bite
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/menu" className="btn-secondary text-lg px-8 py-4">
                  Explore Our Menu
                </Link>
                <Link to="/catering" className="btn-outline text-lg px-8 py-4">
                  Catering Services
                </Link>
              </div>
              <p className="mt-6 text-secondary font-semibold text-sm tracking-wide uppercase">
                📍 Pickup Only — Pay at Pickup
              </p>
            </div>

            {/* Right — Shuffling food images */}
            <div className="flex-1 w-full">
              <ShufflingFoodImages />
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-4">Our Heritage</h2>
          <p className="text-center text-slate max-w-3xl mx-auto mb-12 text-lg">
            Discover the stories behind India's timeless culinary traditions
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card backdrop-blur-sm bg-white/80 p-6 text-center">
              <div className="text-4xl mb-4">🍃</div>
              <h3 className="font-display text-xl font-bold mb-2">Pure Vegetarian Philosophy</h3>
              <p className="text-slate text-sm">
                Indian vegetarian cooking is rooted in Ahimsa — the principle of non-violence. Every dish celebrates life through plant-based ingredients.
              </p>
            </div>
            <div className="card backdrop-blur-sm bg-white/80 p-6 text-center">
              <div className="text-4xl mb-4">🌶️</div>
              <h3 className="font-display text-xl font-bold mb-2">The Story of Spices</h3>
              <p className="text-slate text-sm">
                From turmeric's healing powers to cardamom's royal aroma — Indian spices have shaped world trade routes and Ayurvedic food science.
              </p>
            </div>
            <div className="card backdrop-blur-sm bg-white/80 p-6 text-center">
              <div className="text-4xl mb-4">🍛</div>
              <h3 className="font-display text-xl font-bold mb-2">Regional Traditions</h3>
              <p className="text-slate text-sm">
                From Punjab's hearty thalis to Tamil Nadu's dosa culture and Gujarat's sweet-savory symphony — every region tells a unique culinary story.
              </p>
            </div>
            <div className="card backdrop-blur-sm bg-white/80 p-6 text-center">
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
      <section className="relative py-16 md:py-24">
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
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title mb-4">Visit Us</h2>
          <p className="text-slate mb-8">
            📍 123 Spice Lane, City, ST 12345 | ☎️ (555) 123-4567
          </p>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl h-64 flex items-center justify-center text-slate shadow-md">
            <p>🗺️ Google Maps Embed — Configure with your API key</p>
          </div>
          <p className="mt-4 text-secondary font-semibold">Pickup Only — Pay When You Arrive</p>
        </div>
      </section>
    </div>
  );
}
