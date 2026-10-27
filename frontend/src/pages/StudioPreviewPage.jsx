import React from 'react';
import CreatorStudioShell from '../components/CreatorStudioShell';

// Browser-only preview for development; no login or database and no private tools.
export default function StudioPreviewPage() {
  return <CreatorStudioShell handle="demo" preview />;
}
