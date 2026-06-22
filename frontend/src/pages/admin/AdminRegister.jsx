
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminRegister = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', secretKey: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      toast.success('Admin registered successfully! You can now login.');
      navigate('/admin-login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1326] relative overflow-hidden px-4 py-8">
      {/* Background glow specific for admin */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-rose-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl">

        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Admin Registration</h1>
        <p className="text-sm text-slate-400 mb-8">Create a secure administrator account</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Admin Name"
              className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Admin Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="admin@college.edu"
              className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-400 mb-1.5">Secret Admin Key</label>
            <input
              type="password"
              name="secretKey"
              value={formData.secretKey}
              onChange={handleChange}
              required
              placeholder="Required for admin privileges"
              className="w-full bg-slate-800/50 border border-indigo-500/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium py-3 rounded-xl text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-indigo-500/25 mt-2"
          >
            {loading ? 'Registering...' : 'Register as Admin'}
          </button>
        </form>

        <p className="text-sm text-center text-slate-400 mt-6">
          Already an admin?{' '}
          <Link to="/admin-login" className="text-indigo-400 hover:text-indigo-300 hover:underline font-medium transition-colors">
            Login here
          </Link>
        </p>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <Link to="/register" className="text-xs text-slate-500 hover:text-slate-400 transition-colors">
            ← Back to Student Registration
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminRegister;
