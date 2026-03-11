import { FiMapPin, FiPhone, FiMail, FiInstagram, FiFacebook } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold text-secondary mb-3">Break The Fast</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Authentic Indian Cuisine — 100% Pure Vegetarian. Celebrating the rich heritage of Indian flavors, handcrafted with love and tradition.
            </p>
            <span className="inline-flex items-center gap-1 mt-3 bg-pure-veg text-white text-xs font-bold px-3 py-1 rounded-full">
              🌿 100% Pure Vegetarian
            </span>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/menu" className="hover:text-secondary transition-colors">Full Menu</a></li>
              <li><a href="/catering" className="hover:text-secondary transition-colors">Catering</a></li>
              <li><a href="/about" className="hover:text-secondary transition-colors">Our Story</a></li>
              <li><a href="/login" className="hover:text-secondary transition-colors">Sign In / Order</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Contact Us</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center gap-2"><FiMapPin /> 123 Spice Lane, City, ST 12345</li>
              <li className="flex items-center gap-2"><FiPhone /> (555) 123-4567</li>
              <li className="flex items-center gap-2"><FiMail /> hello@breakthefast.com</li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-secondary text-xl"><FiInstagram /></a>
              <a href="#" className="text-gray-400 hover:text-secondary text-xl"><FiFacebook /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} Break The Fast. All rights reserved. | Pickup Only — No Delivery
        </div>
      </div>
    </footer>
  );
}
