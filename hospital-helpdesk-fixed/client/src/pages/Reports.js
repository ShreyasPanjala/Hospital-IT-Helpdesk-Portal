import { useState } from 'react';
import api from '../services/api';

export default function Reports() {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  const download = async () => {
    setDownloading(true);
    setError('');
    try {
      const response = await api.get('/tickets/reports/download', { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'hospital_helpdesk_report.csv';
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to download report.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="container py-4 animated-fade-in">
      <div className="card-custom">
        <div className="card-body p-4 p-md-5">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="stat-icon-wrapper" style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(14, 165, 233, 0.12)', color: 'var(--secondary-color)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <div>
              <h3 className="fw-bold mb-1">Export Reports Module</h3>
              <p className="text-muted mb-0">Download structured ticket data for hospital administration and IT auditing.</p>
            </div>
          </div>
          
          {error && <div className="alert alert-danger rounded-3 shadow-sm">{error}</div>}
          
          <div className="p-4 rounded-3 mb-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <h6 className="fw-bold text-dark mb-2">Report Content Details:</h6>
            <ul className="mb-0 small text-secondary ps-3">
              <li>Includes all tickets visible to your current access role.</li>
              <li>Columns: Ticket ID, Title, Category, Priority, Status, Assigned Technician, Created By, SLA Due Date, Last Updated.</li>
              <li>Format: Standard CSV (comma separated values) compatible with MS Excel, Google Sheets, or data analytics pipelines.</li>
            </ul>
          </div>

          <button className="btn-primary-custom d-inline-flex align-items-center gap-2" onClick={download} disabled={downloading}>
            {downloading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Generating CSV...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download CSV Report
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
