
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const statusColor = {
  Active: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
  Resolved: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
};

const LostAndFound = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    type: 'Lost',
    contactInfo: '',
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/lost-items', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data.items);
    } catch (err) {
      toast.error('Could not fetch lost and found items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchItems();
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/lost-items', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Item reported successfully!');
      setFormData({ itemName: '', description: '', type: 'Lost', contactInfo: '' });
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not report item.');
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-[#0b1326] py-8 px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Lost & Found 🔍</h1>
        <p className="text-sm text-slate-400 mb-8">
          Report items you have lost or found on campus.
        </p>

        {/* Submit Form */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6">Report an Item</h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Item Name</label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                required
                placeholder="e.g., Blue Water Bottle"
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option value="Lost" className="bg-slate-800">I Lost This</option>
                <option value="Found" className="bg-slate-800">I Found This</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Description & Location</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={2}
                placeholder="Where was it seen last? Distinctive marks?"
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Contact Info</label>
              <input
                type="text"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                required
                placeholder="Phone number or Room No."
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
              />
            </div>

            <div className="md:col-span-2 mt-2">
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium px-6 py-3 rounded-xl text-sm transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-indigo-500/25"
              >
                Post Item
              </button>
            </div>
          </form>
        </div>

        {/* Items Grid */}
        <h2 className="text-2xl font-bold text-white mb-6">Board</h2>
        {loading ? (
          <p className="text-sm text-slate-400">Loading items...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-400">No items reported yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item._id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:bg-white/10 transition-colors flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                    item.type === 'Lost' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {item.type}
                  </span>
                  {item.status === 'Resolved' && (
                    <span className="text-xs text-slate-500 font-medium italic">Resolved</span>
                  )}
                </div>
                <h3 className="font-bold text-white text-lg mb-1">{item.itemName}</h3>
                <p className="text-xs text-slate-400 mb-4">Reported by <span className="text-slate-300">{item.reportedBy?.name || 'Unknown'}</span></p>
                <p className="text-sm text-slate-300 mb-6 flex-grow leading-relaxed">{item.description}</p>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 mt-auto">
                  <p className="text-xs font-semibold text-slate-400 mb-1">Contact:</p>
                  <p className="text-sm text-white">{item.contactInfo}</p>
                </div>
                <p className="text-[10px] text-slate-500 mt-4 text-right">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LostAndFound;
