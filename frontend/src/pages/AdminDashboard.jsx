
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const statusColor = {
  Pending: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
  'In Progress': 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  Resolved: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Approved: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Rejected: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
  Active: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const [activeTab, setActiveTab] = useState('grievances');
  const [grievances, setGrievances] = useState([]);
  const [outpasses, setOutpasses] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState({});

  useEffect(() => {
    if (!token || role !== 'admin') {
      navigate('/login');
    }
  }, [token, role, navigate]);

  const fetchAllGrievances = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/grievances', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedGrievances = res.data.grievances.sort((a, b) => {
        return (b.upvotes?.length || 0) - (a.upvotes?.length || 0);
      });
      setGrievances(sortedGrievances);
      const initialDrafts = {};
      sortedGrievances.forEach((g) => {
        initialDrafts[g._id] = { status: g.status, adminRemark: g.adminRemark || '' };
      });
      setDrafts(initialDrafts);
    } catch (err) {
      toast.error('Fetch grievances failed.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOutpasses = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/outpasses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOutpasses(res.data.outpasses);
    } catch (err) {
      toast.error('Fetch outpasses failed.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllLostItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/lost-items', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLostItems(res.data.items);
    } catch (err) {
      toast.error('Fetch lost items failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && role === 'admin') {
      if (activeTab === 'grievances') fetchAllGrievances();
      if (activeTab === 'outpasses') fetchAllOutpasses();
      if (activeTab === 'lostItems') fetchAllLostItems();
    }
  }, [token, role, activeTab]);

  const handleDraftChange = (id, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleUpdateGrievance = async (id) => {
    try {
      const draft = drafts[id];
      await axios.put(
        `http://localhost:5000/api/grievances/${id}`,
        { status: draft.status, adminRemark: draft.adminRemark },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Grievance updated successfully!');
      fetchAllGrievances();
    } catch (err) {
      toast.error('Failed to update grievance.');
    }
  };

  const handleUpdateOutpass = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/outpasses/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Outpass ${status}!`);
      fetchAllOutpasses();
    } catch (err) {
      toast.error('Failed to update outpass.');
    }
  };

  const handleResolveLostItem = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/lost-items/${id}/resolve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Item marked as resolved!');
      fetchAllLostItems();
    } catch (err) {
      toast.error('Failed to resolve item.');
    }
  };

  if (!token || role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-[#0b1326] py-8 px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Admin Dashboard 🛡️</h1>
        <p className="text-sm text-slate-400 mb-8">Manage all campus modules from one central hub.</p>

        {/* Tabs */}
        <div className="flex space-x-6 border-b border-slate-700 mb-8">
          <button
            onClick={() => setActiveTab('grievances')}
            className={`pb-3 text-sm font-medium border-b-2 transition-all duration-300 ${
              activeTab === 'grievances' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Grievances
          </button>
          <button
            onClick={() => setActiveTab('outpasses')}
            className={`pb-3 text-sm font-medium border-b-2 transition-all duration-300 ${
              activeTab === 'outpasses' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Outpass Requests
          </button>
          <button
            onClick={() => setActiveTab('lostItems')}
            className={`pb-3 text-sm font-medium border-b-2 transition-all duration-300 ${
              activeTab === 'lostItems' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Lost & Found
          </button>
        </div>

        {/* Grievances Tab */}
        {activeTab === 'grievances' && (
          <>
            {loading ? (
              <p className="text-sm text-slate-400">Loading grievances...</p>
            ) : grievances.length === 0 ? (
              <p className="text-sm text-slate-400">No grievances submitted yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {grievances.map((g) => {
                  const currentDraft = drafts[g._id] || { status: g.status, adminRemark: g.adminRemark || '' };
                  const isEscalated = g.isEscalated;
                  const cardBorderColor = isEscalated ? 'border-rose-500/50 shadow-rose-500/10' : 'border-white/10 hover:bg-white/10';

                  return (
                    <div key={g._id} className={`bg-white/5 backdrop-blur-md flex flex-col border rounded-2xl p-6 transition-all shadow-xl ${cardBorderColor}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="pr-2">
                          <h3 className="font-bold text-white text-lg leading-tight mb-1">{g.title}</h3>
                          <p className="text-xs text-slate-400">
                            By <span className="text-slate-300">{g.studentId?.name || 'Unknown'}</span> · {g.category}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[g.status]}`}>
                            {g.status}
                          </span>
                          {isEscalated && (
                            <span className="text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded uppercase tracking-wide">
                              Escalated
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 mb-4 flex-grow leading-relaxed">{g.description}</p>
                      
                      <div className="mb-5">
                        <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                          👍 {g.upvotes?.length || 0} Upvotes
                        </span>
                      </div>
                      
                      <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700 mt-auto">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs text-slate-400 font-medium mb-1.5">New Status</label>
                            <select
                              value={currentDraft.status}
                              onChange={(e) => handleDraftChange(g._id, 'status', e.target.value)}
                              className="w-full bg-slate-800 border border-slate-600 rounded-xl text-sm px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-slate-400 font-medium mb-1.5">Admin Remark</label>
                            <textarea
                              rows={2}
                              value={currentDraft.adminRemark}
                              onChange={(e) => handleDraftChange(g._id, 'adminRemark', e.target.value)}
                              placeholder="Add an official remark..."
                              className="w-full bg-slate-800 border border-slate-600 rounded-xl text-sm px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none placeholder:text-slate-500"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end mt-5">
                          <button
                            onClick={() => handleUpdateGrievance(g._id)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25"
                          >
                            Update Grievance
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Outpasses Tab */}
        {activeTab === 'outpasses' && (
          <>
            {loading ? (
              <p className="text-sm text-slate-400">Loading outpasses...</p>
            ) : outpasses.length === 0 ? (
              <p className="text-sm text-slate-400">No outpass requests.</p>
            ) : (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Destination & Reason</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Dates</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {outpasses.map((op) => (
                      <tr key={op._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{op.studentId?.name || 'Unknown'}</div>
                          <div className="text-sm text-slate-400">{op.studentId?.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">{op.destination}</div>
                          <div className="text-sm text-slate-400 max-w-xs truncate">{op.reason}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white flex flex-col gap-1">
                            <span>Out: {new Date(op.departureDate).toLocaleDateString()}</span>
                            <span>In: {new Date(op.returnDate).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${statusColor[op.status]}`}>
                            {op.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {op.status === 'Pending' && (
                            <div className="flex justify-end gap-3">
                              <button onClick={() => handleUpdateOutpass(op._id, 'Approved')} className="text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-4 py-1.5 rounded-lg border border-emerald-500/20 transition-all">Approve</button>
                              <button onClick={() => handleUpdateOutpass(op._id, 'Rejected')} className="text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-4 py-1.5 rounded-lg border border-rose-500/20 transition-all">Reject</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Lost & Found Tab */}
        {activeTab === 'lostItems' && (
          <>
            {loading ? (
              <p className="text-sm text-slate-400">Loading items...</p>
            ) : lostItems.length === 0 ? (
              <p className="text-sm text-slate-400">No lost/found items active.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {lostItems.map((item) => (
                  <div key={item._id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:bg-white/10 transition-colors flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                        item.type === 'Lost' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {item.type}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[item.status]}`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-lg mb-1">{item.itemName}</h3>
                    <p className="text-xs text-slate-400 mb-4">Reported by <span className="text-slate-300">{item.reportedBy?.name || 'Unknown'}</span></p>
                    <p className="text-sm text-slate-300 mb-6 flex-grow leading-relaxed">{item.description}</p>
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 mt-auto mb-5">
                      <p className="text-xs font-semibold text-slate-400 mb-1">Contact:</p>
                      <p className="text-sm text-white">{item.contactInfo}</p>
                    </div>
                    {item.status === 'Active' && (
                      <button
                        onClick={() => handleResolveLostItem(item._id)}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-3 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25"
                      >
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
