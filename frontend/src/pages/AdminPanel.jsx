import { useState, useEffect } from 'react';
import { pollAPI } from '../services/api';
import { Trash2, Plus, LayoutDashboard } from 'lucide-react';

export default function AdminPanel() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPoll, setNewPoll] = useState({ title: '', description: '', startTime: '', endTime: '' });
  const [newOptions, setNewOptions] = useState([{ text: '' }, { text: '' }]);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await pollAPI.getAllPolls();
      setPolls(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (!window.confirm("Are you sure you want to delete this election? All votes will be lost.")) {
      return;
    }
    try {
      await pollAPI.deletePoll(pollId);
      fetchPolls();
    } catch (err) {
      alert("Failed to delete poll");
    }
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    try {
      const formattedPoll = {
        ...newPoll,
        startTime: new Date(newPoll.startTime).toISOString(),
        endTime: new Date(newPoll.endTime).toISOString(),
        options: newOptions.filter(opt => opt.text.trim() !== '')
      };
      await pollAPI.createPoll(formattedPoll);
      fetchPolls();
      setNewPoll({ title: '', description: '', startTime: '', endTime: '' });
      setNewOptions([{ text: '' }, { text: '' }]);
      alert("Poll created successfully!");
    } catch (err) {
      alert('Failed to create poll');
    }
  };

  const handleOptionChange = (index, value) => {
    const updated = [...newOptions];
    updated[index].text = value;
    setNewOptions(updated);
  };

  const addOptionField = () => {
    setNewOptions([...newOptions, { text: '' }]);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-100 p-2.5 rounded-xl">
          <LayoutDashboard className="w-6 h-6 text-indigo-700" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Create Poll Section */}
        <div className="xl:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              New Election
            </h2>
            <form onSubmit={handleCreatePoll} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text" required
                  className="block w-full px-4 py-2.5 rounded-lg border-gray-300 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={newPoll.title} onChange={e => setNewPoll({...newPoll, title: e.target.value})}
                  placeholder="e.g. Student Council 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required rows="3"
                  className="block w-full px-4 py-2.5 rounded-lg border-gray-300 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={newPoll.description} onChange={e => setNewPoll({...newPoll, description: e.target.value})}
                  placeholder="Provide details about this election..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="datetime-local" required
                    className="block w-full px-3 py-2 rounded-lg border-gray-300 border focus:ring-2 focus:ring-indigo-500 text-sm"
                    value={newPoll.startTime} onChange={e => setNewPoll({...newPoll, startTime: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="datetime-local" required
                    className="block w-full px-3 py-2 rounded-lg border-gray-300 border focus:ring-2 focus:ring-indigo-500 text-sm"
                    value={newPoll.endTime} onChange={e => setNewPoll({...newPoll, endTime: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Voting Options</h3>
                <div className="space-y-3">
                  {newOptions.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Option ${idx + 1}`}
                      required={idx < 2} 
                      className="block w-full px-4 py-2.5 rounded-lg border-gray-300 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      value={opt.text}
                      onChange={e => handleOptionChange(idx, e.target.value)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addOptionField}
                  className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-md hover:bg-indigo-100 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Option
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg shadow-md text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all hover:-translate-y-0.5 mt-6"
              >
                Launch Election
              </button>
            </form>
          </div>
        </div>

        {/* Manage Polls Section */}
        <div className="xl:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Manage Elections</h2>
            <div className="space-y-6">
              {polls.map(poll => {
                const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                
                return (
                  <div key={poll.id} className="border border-gray-100 bg-gray-50/50 rounded-xl p-5 hover:border-gray-200 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{poll.title}</h3>
                        <p className="text-gray-500 text-sm font-medium mt-1">
                          Ends: {new Date(poll.endTime).toLocaleString(undefined, {
                            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeletePoll(poll.id)}
                        className="text-red-500 hover:text-white hover:bg-red-500 bg-white border border-red-100 p-2.5 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-red-500 focus:outline-none"
                        title="Delete Election"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Candidate / Option</th>
                            <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider w-32">Votes</th>
                            <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-48">Percentage</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50">
                          {poll.options.map(opt => {
                            const percentage = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
                            return (
                              <tr key={opt.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{opt.text}</td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-indigo-600 text-right">{opt.votes}</td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                    <span className="text-xs font-medium text-gray-500 w-8">{percentage}%</span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
              {polls.length === 0 && (
                <div className="text-center flex flex-col items-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <LayoutDashboard className="w-10 h-10 text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No elections created yet.</p>
                  <p className="text-sm text-gray-400 mt-1">Use the form to create your first poll.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}