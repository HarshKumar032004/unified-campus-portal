
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // 'student' or 'admin'
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-[#0b1326]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* App name / Logo */}
        <Link to="/" className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5 group">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-xl shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <span className="text-white text-lg leading-none block">🎓</span>
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
            Unified Campus Helpdesk
          </span>
        </Link>

        {/* Navigation links */}
        <div className="flex items-center gap-6">

          {token ? (
            <>
              {role === 'admin' ? (
                <Link
                  to="/admin"
                  className={`text-sm font-medium transition-colors ${isActive('/admin') ? 'text-indigo-400' : 'text-slate-300 hover:text-white'}`}
                >
                  Admin Panel
                </Link>
              ) : (
                <>
                  <Link
                    to="/student-dashboard"
                    className={`text-sm font-medium transition-colors ${isActive('/student-dashboard') ? 'text-indigo-400' : 'text-slate-300 hover:text-white'}`}
                  >
                    Grievances
                  </Link>
                  <Link
                    to="/outpass"
                    className={`text-sm font-medium transition-colors ${isActive('/outpass') ? 'text-indigo-400' : 'text-slate-300 hover:text-white'}`}
                  >
                    Outpass
                  </Link>
                  <Link
                    to="/lost-found"
                    className={`text-sm font-medium transition-colors ${isActive('/lost-found') ? 'text-indigo-400' : 'text-slate-300 hover:text-white'}`}
                  >
                    Lost & Found
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="text-sm bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-4 py-2 rounded-xl font-medium transition-all hover:scale-105 ml-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-slate-300 hover:text-white font-medium transition-colors"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white px-5 py-2 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/25 hover:scale-105"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
