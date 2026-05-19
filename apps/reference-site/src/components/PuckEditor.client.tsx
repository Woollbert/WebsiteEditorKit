'use client';

import { Puck, type Data } from '@puckeditor/core';
import '@puckeditor/core/puck.css';
import { useState } from 'react';
import { puckConfig } from '@/puck/config';

type Props = {
  slug: string;
  initialData: Data;
  editorToken: string;
};

export default function PuckEditor({ slug, initialData, editorToken }: Props) {
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async (data: Data) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/save-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-editor-token': editorToken,
        },
        body: JSON.stringify({ slug, data }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Save failed (${res.status})`);
      }
      setSavedAt(new Date().toLocaleTimeString());
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {(saving || savedAt || error) && (
        <div
          style={{
            position: 'fixed',
            top: 10,
            right: 10,
            padding: '8px 14px',
            borderRadius: 6,
            background: error ? '#fee' : saving ? '#fef9c3' : '#dcfce7',
            color: error ? '#991b1b' : saving ? '#854d0e' : '#166534',
            fontSize: 14,
            zIndex: 9999,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          {error
            ? `Error: ${error}`
            : saving
              ? 'Publishing…'
              : `Published at ${savedAt} — auto-deploy will be live in ~60s`}
        </div>
      )}
      <Puck config={puckConfig} data={initialData} onPublish={handlePublish} />
    </div>
  );
}
