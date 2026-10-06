import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Target, FileText } from 'lucide-react';
import { getProjectContributions } from '../../api/contributionService';
import toast from 'react-hot-toast';

export default function ContributionsTab({ projectId }) {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all');
  const [totals, setTotals] = useState({ members: 0, total: 0, tasks: 0, outputs: 0 });

  useEffect(() => {
    fetchContributions();
  }, [projectId, period]);

  const fetchContributions = async () => {
    setLoading(true);
    try {
      const data = await getProjectContributions(projectId, period);
      if (data.success) {
        setContributions(data.members || []);
        
        let tMembers = data.members.length;
        let tTotal = 0;
        let tTasks = 0;
        let tOutputs = 0; // documents + papers + resources + references
        
        data.members.forEach(m => {
          tTotal += m.totalContributions;
          tTasks += m.tasksCompleted;
          tOutputs += (m.documentsUploaded + m.researchPapersAdded + m.resourcesAdded + m.referencesAdded);
        });

        setTotals({ members: tMembers, total: tTotal, tasks: tTasks, outputs: tOutputs });
      }
    } catch (err) {
      toast.error('Failed to load contribution tracking data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-500 dark:text-slate-400">
        Loading contributions...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Contribution Tracking</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">See how each team member is contributing to this research project.</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:border-primary-500 transition-colors"
        >
          <option value="all">All Time</option>
          <option value="90d">Last 90 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="7d">Last 7 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contributors</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{totals.members}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Actions</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{totals.total}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Target size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tasks Done</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{totals.tasks}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Research Outputs</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{totals.outputs}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {contributions.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No members found.</p>
          </div>
        ) : totals.total === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No contributions have been recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                  <th className="p-4">Member</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 text-center">Total</th>
                  <th className="p-4 text-center">Tasks</th>
                  <th className="p-4 text-center">Docs</th>
                  <th className="p-4 text-center">Papers</th>
                  <th className="p-4 text-center">Resources</th>
                  <th className="p-4 text-center">Refs</th>
                  <th className="p-4 text-center">Milestones</th>
                  <th className="p-4 text-center">Comments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {contributions.map((m) => (
                  <tr key={m.user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {m.user.avatar ? (
                          <img src={m.user.avatar} alt={m.user.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold text-xs shrink-0">
                            {m.user.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{m.user.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{m.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 capitalize text-slate-600 dark:text-slate-400">
                      {m.role}
                    </td>
                    <td className="p-4 text-center font-bold text-primary-600 dark:text-primary-400">
                      {m.totalContributions}
                    </td>
                    <td className="p-4 text-center text-slate-600 dark:text-slate-400">
                      {m.tasksCompleted} <span className="text-xs text-slate-400">({m.tasksCreated} created)</span>
                    </td>
                    <td className="p-4 text-center text-slate-600 dark:text-slate-400">{m.documentsUploaded}</td>
                    <td className="p-4 text-center text-slate-600 dark:text-slate-400">{m.researchPapersAdded}</td>
                    <td className="p-4 text-center text-slate-600 dark:text-slate-400">{m.resourcesAdded}</td>
                    <td className="p-4 text-center text-slate-600 dark:text-slate-400">{m.referencesAdded}</td>
                    <td className="p-4 text-center text-slate-600 dark:text-slate-400">{m.milestonesCompleted}</td>
                    <td className="p-4 text-center text-slate-600 dark:text-slate-400">{m.commentsMade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
