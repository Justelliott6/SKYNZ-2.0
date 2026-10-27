import { API_URL } from '../config/api';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import PublicCreatorPage from './PublicCreatorPage';
import PersonalCreatorApps from '../components/PersonalCreatorApps';

// The studio is private. Ownership is checked against the authenticated
// creator's page list before any owner-only tools are rendered.
export default function CreatorStudioPage() {
  const { handle } = useParams();
  const { token } = useAuthStore();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    async function verifyOwnership() {
      setStatus('loading');
      try {
        const response = await fetch(`${API_URL}/api/pages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Unable to verify page ownership');
        const pages = await response.json();
        if (active) setStatus(Array.isArray(pages) && pages.some(page => page.handle === handle) ? 'owner' : 'denied');
      } catch {
        if (active) setStatus('error');
      }
    }
    verifyOwnership();
    return () => { active = false; };
  }, [handle, token]);

  if (status !== 'owner') {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1 className="text-2xl font-bold mb-3">Creator Studio</h1>
        <p>{status === 'loading' ? 'Checking page access...' : status === 'denied' ? 'This page is not in your account.' : 'Unable to verify page ownership. Please try again.'}</p>
        <Link className="text-purple-300 underline mt-4 inline-block" to="/dashboard">Return to dashboard</Link>
      </main>
    );
  }

  return (
    <main className="bg-black">
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <p className="text-purple-300 text-sm mb-2">Private owner workspace · @{handle}</p>
        <PersonalCreatorApps isOwner />
      </div>
      <PublicCreatorPage />
    </main>
  );
}
