import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiHeart } from 'react-icons/fi'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import toast from 'react-hot-toast'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { token, user, logout } = useAuthStore()
  const { item_count, fetchCart } = useCartStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (token) fetchCart()
  }, [token])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    useCartStore.getState().reset()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsOpen(false)
    }
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
    { to: '/learn', label: 'Learn' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - left */}
          <Link to="/" className="flex items-center shrink-0">
            <img src="/logo.png" alt="PrimeCrop" className="h-14 w-auto" />
          </Link>

          {/* Desktop: Search, Nav Links, Actions - all right aligned */}
          <div className="hidden md:flex items-center gap-6">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search mushrooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 pr-8 py-1.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-forest-500 bg-gray-50 w-44"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-forest-700">
                  <FiSearch size={14} />
                </button>
              </div>
            </form>

            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-gray-700 hover:text-forest-800 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-forest-800 transition-colors">
              <FiShoppingCart size={20} />
              {item_count > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {item_count > 9 ? '9+' : item_count}
                </span>
              )}
            </Link>

            {token ? (
              <div className="relative group">
                <button className="flex items-center gap-1 p-2 text-gray-700 hover:text-forest-800 transition-colors">
                  <div className="w-7 h-7 bg-forest-800 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}</span>
                  </div>
                  <span className="text-sm font-medium truncate max-w-[80px]">
                    {user?.full_name?.split(' ')[0] || 'Account'}
                  </span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link to="/dashboard" className="block px-4 py-3 text-sm text-gray-700 hover:bg-forest-50 hover:text-forest-800 rounded-t-xl">
                    My Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-xl"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-primary !px-4 !py-2 text-sm">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile: hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/cart" className="relative p-2 text-gray-700">
              <FiShoppingCart size={20} />
              {item_count > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {item_count > 9 ? '9+' : item_count}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700"
            >
              {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 input-field !py-2 text-sm"
            />
            <button type="submit" className="btn-primary !px-4 !py-2 text-sm">
              <FiSearch />
            </button>
          </form>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className="block py-2 text-gray-700 font-medium hover:text-forest-800"
            >
              {link.label}
            </Link>
          ))}
          {token ? (
            <>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 font-medium hover:text-forest-800">
                My Account
              </Link>
              <button onClick={handleLogout} className="block w-full text-left py-2 text-red-600 font-medium">
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)} className="block py-2 text-forest-700 font-semibold">
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}