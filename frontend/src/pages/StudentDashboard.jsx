
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

// Modern status colors
const statusColor = {
  Pending: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
  'In Progress': 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  Resolved: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const [activeTab, setActiveTab] = useState('myGrievances');
  const [grievances, setGrievances] = useState([]);
  const [publicGrievances, setPublicGrievances] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Academics',
    isAnonymous: false,
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchMyGrievances = async () => {
    setLoadingList(true);
    try {
      const res = await axios.get('http://localhost:5000/api/grievances/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGrievances(res.data.grievances);
    } catch (err) {
      toast.error('Could not fetch grievances.');
    } finally {
      setLoadingList(false);
    }
  };

  const fetchPublicGrievances = async () => {
    setLoadingList(true);
    try {
      const res = await axios.get('http://localhost:5000/api/grievances/public', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPublicGrievances(res.data.grievances);
    } catch (err) {
      toast.error('Could not fetch public grievances.');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (token) {
      if (activeTab === 'myGrievances') {
        fetchMyGrievances();
      } else {
        fetchPublicGrievances();
      }
    }
  }, [token, activeTab]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/grievances', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Grievance submitted successfully!');
      setFormData({ title: '', description: '', category: 'Academics', isAnonymous: false });
      
      if (activeTab === 'myGrievances') {
        fetchMyGrievances();
      } else {
        fetchPublicGrievances();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit grievance.');
    }
  };

  const handleUpvote = async (grievanceId) => {
    try {
      await axios.put(`http://localhost:5000/api/grievances/${grievanceId}/upvote`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Upvoted successfully!');
      fetchPublicGrievances();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upvote.');
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-[#0b1326] py-8 px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
          Welcome, {user?.name} 👋
        </h1>
        <p className="text-sm text-slate-400 mb-8">
          You can submit grievances and track their status below.
        </p>

        {/* Submit Grievance Form */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6">Submit a New Grievance</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Brief title of your issue"
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option value="Academics" className="bg-slate-800">Academics</option>
                <option value="Hostel" className="bg-slate-800">Hostel</option>
                <option value="Exam" className="bg-slate-800">Exam</option>
                <option value="Fees" className="bg-slate-800">Fees</option>
                <option value="Infrastructure" className="bg-slate-800">Infrastructure</option>
                <option value="Library" className="bg-slate-800">Library</option>
                <option value="Anti-Ragging" className="bg-slate-800">Anti-Ragging</option>
                <option value="Placements" className="bg-slate-800">Placements</option>
                <option value="Other" className="bg-slate-800">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Describe your issue in detail..."
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isAnonymous"
                id="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
                className="h-4 w-4 bg-slate-800 border-slate-700 rounded text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900"
              />
              <label htmlFor="isAnonymous" className="ml-2 block text-sm text-slate-300">
                Submit Anonymously (Hide my identity)
              </label>
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium px-6 py-3 rounded-xl text-sm transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-indigo-500/25 mt-2"
            >
              Submit Grievance
            </button>
          </form>
        </div>

        {/* Tabs Navigation */}
        <div className="flex space-x-6 border-b border-slate-700 mb-8">
          <button
            onClick={() => setActiveTab('myGrievances')}
            className={`pb-3 text-sm font-medium border-b-2 transition-all duration-300 ${
              activeTab === 'myGrievances'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            My Grievances
          </button>
          <button
            onClick={() => setActiveTab('publicBoard')}
            className={`pb-3 text-sm font-medium border-b-2 transition-all duration-300 ${
              activeTab === 'publicBoard'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Public Board
          </button>
        </div>

        {/* Tab Content: My Grievances */}
        {activeTab === 'myGrievances' && (
          <div className="space-y-4">
            {loadingList ? (
              <p className="text-sm text-slate-400">Loading...</p>
            ) : grievances.length === 0 ? (
              <p className="text-sm text-slate-400">You haven't submitted any grievances yet.</p>
            ) : (
              grievances.map((g) => (
                <div key={g._id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-white text-lg">{g.title}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[g.status]}`}>
                      {g.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">
                    Category: <span className="font-medium text-slate-300">{g.category}</span>
                  </p>
                  <p className="text-sm text-slate-300 mb-5 leading-relaxed">{g.description}</p>
                  
                  {g.adminRemark && (
                    <div className="mt-4 bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/20">
                      <p className="text-xs font-semibold text-indigo-400 mb-1">Admin Remark:</p>
                      <p className="text-sm text-slate-300">{g.adminRemark}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-700/50">
                    <p className="text-xs text-slate-500">
                      Submitted: {new Date(g.createdAt).toLocaleDateString()}
                    </p>
                    {g.upvotes?.length > 0 && (
                      <span className="text-xs text-indigo-400 font-medium bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
                        👍 {g.upvotes.length} Upvotes
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Content: Public Board */}
        {activeTab === 'publicBoard' && (
          <div className="space-y-4">
            {loadingList ? (
              <p className="text-sm text-slate-400">Loading...</p>
            ) : publicGrievances.length === 0 ? (
              <p className="text-sm text-slate-400">No public grievances available.</p>
            ) : (
              publicGrievances.map((g) => (
                <div key={g._id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-white text-lg">{g.title}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[g.status]}`}>
                      {g.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">
                    Category: <span className="font-medium text-slate-300">{g.category}</span>
                    <span className="mx-2 text-slate-600">•</span>
                    By: <span className="text-slate-300">{g.studentId?.name || 'Unknown Student'}</span>
                  </p>
                  <p className="text-sm text-slate-300 mb-5 leading-relaxed">{g.description}</p>

                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-700/50">
                    <button
                      onClick={() => handleUpvote(g._id)}
                      disabled={g.upvotes?.includes(user?.id)}
                      className={`text-sm font-medium px-5 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                        g.upvotes?.includes(user?.id)
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                          : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 hover:scale-[1.02]'
                      }`}
                    >
                      <span>👍 Support this</span>
                      <span className="bg-slate-900/50 px-2 py-0.5 rounded-full text-xs">
                        {g.upvotes?.length || 0}
                      </span>
                    </button>
                    <p className="text-xs text-slate-500">
                      {new Date(g.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentDashboard;
