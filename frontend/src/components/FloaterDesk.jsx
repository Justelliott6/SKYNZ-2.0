import React, { useEffect, useState } from 'react';
import { API_URL } from '../config/api';
import useAuthStore from '../store/authStore';

const FLOATER_URL = 'http://127.0.0.1:37642';

export default function FloaterDesk({ preview = false }) {
  const { token } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!token || preview) {
      setData({ connected: false, error: 'Sign in to read live Floater status.' });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(API_URL + '/api/studio/floater/status', {
        headers: { Authorization: 'Bearer ' + token }
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Status request failed');
      setData(result);
    } catch (error) { setData({ connected: false, error: error.message }); }
    finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, [token, preview]);

  return (
    <section aria-label="Floater Agent desk" className="space-y-5">
      <p className="text-gray-300">
        Persistent local agent: model-flexible planning, Builder and Reviewer roles, queued tasks, memory and human approval for consequential actions.
      </p>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={refresh} disabled={loading} className="rounded-lg bg-gray-800 text-white px-5 py-3">
          {loading ? 'Checking...' : 'Refresh agent status'}
        </button>
        <a href={FLOATER_URL} target="_blank" rel="noopener noreferrer"
          className="inline-block rounded-lg bg-purple-700 hover:bg-purple-600 px-5 py-3 text-white font-semibold">
          Open Floater control desk
        </a>
      </div>
      <div role="status" className="rounded-xl bg-black/60 border border-purple-500/30 p-5">
        {data?.connected ? (
          <>
            <p className="text-green-300 font-semibold">Floater connected to local SKYNZ backend</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-sm">
              <div><p className="text-gray-400">State</p><p className="text-white font-semibold">{data.paused ? 'Paused' : data.active ? 'Working' : 'Ready'}</p></div>
              <div><p className="text-gray-400">Model</p><p className="text-white break-all">{data.model || 'Not configured'}</p></div>
              <div><p className="text-gray-400">Recent tasks</p><p className="text-white">{data.taskCount}</p></div>
              <div><p className="text-gray-400">Approvals waiting</p><p className="text-white">{data.approvalsPending}</p></div>
            </div>
            {data.tasks?.length > 0 && (
              <div className="mt-5">
                <h3 className="text-white font-semibold mb-3">Agent activity</h3>
                <div className="space-y-2">
                  {data.tasks.map(task => (
                    <div key={task.id} className="rounded-lg bg-gray-900 p-3 text-sm flex flex-wrap justify-between gap-2">
                      <span className="text-gray-200">{task.goal || 'Untitled task'}</span>
                      <span className="text-cyan-300">{task.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : <p className="text-amber-200">{data?.error || 'Checking Floater connection...'}</p>}
      </div>
      <p className="text-gray-400 text-sm">
        The agent's own control desk handles task creation and approvals. Its local security policy intentionally blocks embedding the control screen inside this site; the live-status panel here is the integrated part.
      </p>
    </section>
  );
}
