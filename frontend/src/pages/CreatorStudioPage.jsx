import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_URL } from '../config/api';
import useAuthStore from '../store/authStore';
import CreatorStudioShell from '../components/CreatorStudioShell';

// Only show owner tools after the backend confirms the page is owned by this account.
export default function CreatorStudioPage() {
  const { handle } = useParams();
  const { token } = useAuthStore();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    const verify = async () => {
      setStatus('loading');
      try {
        const response = await fetch(API_URL + '/api/pages', {
          headers: { Authorization: 'Bearer ' + token }
        });
        if (!response.ok) throw new Error('Unable to verify ownership.');
        const pages = await response.json();
        if (active) setStatus(Array.isArray(pages) && pages.some(page => page.handle === handle) ? 'owner' : 'denied');
      } catch {
        if (active) setStatus('error');
      }
    };
    verify();
    return () => { active = false; };
  }, [handle, token]);

  if (status === 'owner') return <CreatorStudioShell handle={handle} />;
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-3">SKYNZ Creator Studio</h1>
      <p className="text-gray-300">
        {status === 'loading' ? 'Verifying this page belongs to you...' :
         status === 'denied' ? 'That page is not associated with your account.' :
         'We could not verify page ownership. Check the backend and database connection.'}
      </p>
      <Link to="/dashboard" className="inline-block mt-5 text-cyan-300 underline">Back to dashboard</Link>
    </main>
  );
}
