import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin, FiExternalLink } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <img src="/logo.png" alt="PrimeCrop" className="h-20 w-auto brightness-0 invert" />
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-5">
              Nature's finest mushrooms, cultivated to perfection in Malaysia. Premium quality for discerning health enthusiasts.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com/theprimecrop" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold-500 transition-colors">
                  <span className="text-xs font-bold">IG</span>
              </a>
              <a href="https://facebook.com/theprimecrop" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold-500 transition-colors">
                <span className="text-xs font-bold">FB</span>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/products', label: 'Fresh Mushrooms' },
                { to: '/products', label: 'Dried Mushrooms' },
                { to: '/products', label: 'Supplements' },
                { to: '/products', label: 'Gift Collections' },
                { to: '/products', label: 'Featured Products' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-gold-400 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/#about', label: 'About PrimeCrop' },
                { to: '/#why-us', label: 'Why Choose Us' },
                { to: '/products', label: 'All Products' },
                { to: '/dashboard', label: 'My Account' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-gold-400 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <FiMail size={14} className="mt-0.5 text-gold-400 shrink-0" />
                <a href="mailto:hello@theprimecrop.com" className="hover:text-gold-400 transition-colors">
                  hello@theprimecrop.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FiPhone size={14} className="mt-0.5 text-gold-400 shrink-0" />
                <span>+60 14-900 2831</span>
              </li>
              <li className="flex items-start gap-2">
                <FiMapPin size={14} className="mt-0.5 text-gold-400 shrink-0" />
                <span>Kuala Lumpur, Malaysia</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} PrimeCrop Sdn. Bhd. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-gold-400">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gold-400">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
