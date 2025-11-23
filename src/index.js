document.getElementById("root").innerHTML = `
  <div style="max-width: 1200px; margin: 0 auto;">
    <h1 style="color: #fbbf24; font-size: 3rem; margin-bottom: 1rem;">🔍 Identify Anything</h1>
    <p style="color: #9ca3af; font-size: 1.2rem; margin-bottom: 2rem;">Universal object identification & provenance tracking</p>
    
    <div style="background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.2); border-radius: 8px; padding: 2rem;">
      <h2 style="margin-top: 0;">📋 Ingestion API</h2>
      <p>Endpoint: <code style="background: rgba(0,0,0,0.5); padding: 0.25rem 0.5rem; border-radius: 4px;">/api/identify-anything/ingest</code></p>
      <p>Status: <strong style="color: #10b981;">ACTIVE</strong></p>
      <p style="color: #9ca3af; font-size: 0.875rem;">POST objects to generate UUIDs, SHA-256 hashes, and provenance records</p>
    </div>
  </div>
`;
