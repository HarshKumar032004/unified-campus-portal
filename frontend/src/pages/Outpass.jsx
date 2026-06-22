
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const statusColor = {
  Pending: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
  Approved: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Rejected: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
};

const Outpass = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [outpasses, setOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    destination: '',
    reason: '',
    departureDate: '',
    returnDate: '',
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchMyOutpasses = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/outpasses/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOutpasses(res.data.outpasses);
    } catch (err) {
      toast.error('Could not fetch outpasses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMyOutpasses();
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/outpasses', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Outpass applied successfully!');
      setFormData({ destination: '', reason: '', departureDate: '', returnDate: '' });
      fetchMyOutpasses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not apply for outpass.');
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-[#0b1326] py-8 px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Hostel Outpass ✈️</h1>
        <p className="text-sm text-slate-400 mb-8">
          Apply for leave and track your application status.
        </p>

        {/* Apply Form */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6">Apply for Outpass</h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Destination</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                placeholder="e.g., Home Address / Event Location"
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Departure Date</label>
              <input
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                required
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Return Date</label>
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                required
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Reason for Leave</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows={2}
                placeholder="Detailed reason..."
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
              />
            </div>

            <div className="md:col-span-2 mt-2">
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium px-6 py-3 rounded-xl text-sm transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-indigo-500/25"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>

        {/* History List */}
        <h2 className="text-2xl font-bold text-white mb-6">My Outpasses</h2>
        {loading ? (
          <p className="text-sm text-slate-400">Loading outpasses...</p>
        ) : outpasses.length === 0 ? (
          <p className="text-sm text-slate-400">No outpasses applied yet.</p>
        ) : (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Destination & Reason</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {outpasses.map((op) => (
                  <tr key={op._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{op.destination}</div>
                      <div className="text-sm text-slate-400 truncate max-w-xs">{op.reason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300 flex flex-col gap-1">
                        <span>Out: {new Date(op.departureDate).toLocaleDateString()}</span>
                        <span>In: {new Date(op.returnDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${statusColor[op.status]}`}>
                        {op.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Outpass;
