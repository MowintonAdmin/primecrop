import { NavLink, useNavigate } from 'react-router-dom'
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers, FiTag, FiLogOut, FiX
} from 'react-icons/fi'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const NAV_LINKS = [
  { to: '/',          icon: FiGrid,        label: 'Dashboard', exact: true },
  { to: '/orders',    icon: FiShoppingBag, label: 'Orders' },
  { to: '/products',  icon: FiPackage,     label: 'Products' },
  { to: '/categories',icon: FiTag,         label: 'Categories' },
  { to: '/users',     icon: FiUsers,       label: 'Customers' },
]

export default function Sidebar({ onClose }) {
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <div className="flex flex-col h-full bg-forest-950 text-white w-64">
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
        <div className="bg-white rounded-xl">
          <img src="/logo.png" alt="PrimeCrop" className="h-11 w-auto" />
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <FiX size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_LINKS.map(({ to, icon: Icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-gray-400 hover:bg-white/8 hover:text-white'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/8 w-full transition-colors"
        >
          <FiLogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  )
}
