// components/AvatarUpload.js
'use client';
import { useState, useRef } from 'react';

export default function AvatarUpload({ onUploaded }) {
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e) {
    e.preventDefault();
    if (!fileRef.current.files?.[0]) return;
    setUploading(true);
    const file = fileRef.current.files[0];

    const res = await fetch(`/api/avatar/upload`, {
      method: 'POST',
      headers: { 'x-filename': file.name },
      body: file,
    });

    const blob = await res.json();
    setUploading(false);
    if (blob.url) onUploaded(blob.url);
  }

  return (
    <form onSubmit={handleUpload} className="space-y-2">
      <input type="file" accept="image/*" ref={fileRef} required />
      <button type="submit" disabled={uploading} className="bg-blue-600 text-white px-4 py-2 rounded">
        {uploading ? 'Uploading...' : 'Upload Avatar'}
      </button>
    </form>
  );
}
