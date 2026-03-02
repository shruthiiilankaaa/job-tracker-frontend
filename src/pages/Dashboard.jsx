import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';

const STATUS_COLORS = {
  Applied: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  OA: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  Interview: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  Rejected: 'bg-red-500/20 text-red-400 border border-red-500/30',
  Offer: 'bg-green-500/20 text-green-400 border border-green-500/30',
};

const STATUSES = ['Applied', 'OA', 'Interview', 'Rejected', 'Offer'];

const emptyForm = {
  companyName: '',
  role: '',
  status: 'Applied',
  appliedDate: '',
  notes: '',
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({});
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (search) params.company = search;
      const { data } = await API.get('/jobs', { params });
      setJobs(data.jobs);
    } catch {
      toast.error('Failed to fetch jobs');
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/jobs/stats');
      setStats(data);
    } catch {}
  };

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, [filterStatus, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await API.put(`/jobs/${editId}`, form);
        toast.success('Job updated!');
      } else {
        await API.post('/jobs', form);
        toast.success('Job added!');
      }
      setForm(emptyForm);
      setEditId(null);
      setShowModal(false);
      fetchJobs();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (job) => {
    setForm({
      companyName: job.companyName,
      role: job.role,
      status: job.status,
      appliedDate: job.appliedDate?.slice(0, 10),
      notes: job.notes,
    });
    setEditId(job._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this application?')) return;
    try {
      await API.delete(`/jobs/${id}`);
      toast.success('Deleted!');
      fetchJobs();
      fetchStats();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Toaster />

      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">🚀 Job Tracker</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Hey, {user?.name} 👋</span>
          <button
            onClick={logout}
            className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {STATUSES.map((s) => (
            <div key={s} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{stats[s] || 0}</p>
              <p className="text-gray-400 text-sm mt-1">{s}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="🔍 Search company..."
            className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button
            onClick={() => { setForm(emptyForm); setEditId(null); setShowModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition"
          >
            + Add Job
          </button>
        </div>

        {/* Jobs Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {jobs.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-4xl mb-3">📭</p>
              <p>No applications yet. Add your first one!</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-800 text-gray-400 text-sm">
                <tr>
                  <th className="text-left px-6 py-4">Company</th>
                  <th className="text-left px-6 py-4">Role</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Applied</th>
                  <th className="text-left px-6 py-4">Notes</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-800/50 transition">
                    <td className="px-6 py-4 font-semibold">{job.companyName}</td>
                    <td className="px-6 py-4 text-gray-300">{job.role}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[job.status]}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {job.appliedDate ? new Date(job.appliedDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm max-w-xs truncate">{job.notes || '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(job)}
                          className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="text-xs bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 py-1.5 rounded-lg transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-6">{editId ? 'Update Job' : 'Add New Job'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Company Name"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Role (e.g. SDE Intern)"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
              />
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <input
                type="date"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                value={form.appliedDate}
                onChange={(e) => setForm({ ...form, appliedDate: e.target.value })}
              />
              <textarea
                placeholder="Notes (optional)"
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editId ? 'Update' : 'Add Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}