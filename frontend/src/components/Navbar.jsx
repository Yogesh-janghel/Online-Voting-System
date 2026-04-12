import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Vote } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} className="flex-shrink-0 flex items-center gap-2 group">
              <div className="bg-indigo-50 p-2 rounded-lg group-hover:bg-indigo-100 transition-colors">
                <Vote className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">OVS</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900">{user.username}</span>
              <span className="text-xs text-gray-500 font-medium">{user.role}</span>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            {user.role === 'ADMIN' && (
              <Link to="/admin" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">Admin Panel</Link>
            )}
            {user.role === 'USER' && (
              <Link to="/dashboard" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">Dashboard</Link>
            )}
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-gray-700 bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};