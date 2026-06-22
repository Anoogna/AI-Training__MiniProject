import { useEffect, useMemo, useState } from 'react';
import { leadAPI } from '../services/api';

const statusOptions = ['new', 'contacted', 'qualified', 'closed'];
const typeOptions = [
  { label: 'All', value: '' },
  { label: 'Demo Requests', value: 'demo_request' },
  { label: 'Newsletter', value: 'newsletter' },
  { label: 'Contact', value: 'contact' },
];

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (type) params.type = type;
      if (status) params.status = status;
      const res = await leadAPI.list(params);
      setLeads(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [type, status]);

  const metrics = useMemo(() => ({
    total: leads.length,
    demos: leads.filter((lead) => lead.type === 'demo_request').length,
    newsletter: leads.filter((lead) => lead.type === 'newsletter').length,
    open: leads.filter((lead) => lead.status === 'new').length,
  }), [leads]);

  const filteredLeads = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return leads;

    return leads.filter((lead) => {
      const haystack = [lead.name, lead.email, lead.company, lead.phone, lead.message, lead.type, lead.status]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [leads, query]);

  const exportCsv = () => {
    const header = ['createdAt', 'type', 'name', 'email', 'company', 'phone', 'status', 'message'];
    const rows = filteredLeads.map((lead) => header.map((field) => `"${String(lead[field] ?? '').replaceAll('"', '""')}"`));
    const csv = [header.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `dispatchai-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const updateStatus = async (leadId, nextStatus) => {
    await leadAPI.update(leadId, { status: nextStatus });
    setMessage('Lead status updated successfully.');
    load();
  };

  return (
    <div className="page">
      <div className="panel leads-panel">
        <p className="eyebrow">Lead management</p>
        <h1>MongoDB Leads Dashboard</h1>
        <p className="hero-copy">Review demo requests, newsletter signups, and contact submissions captured from the landing page.</p>

        <div className="stats-grid" style={{ marginTop: '1rem' }}>
          <div className="stat-card"><span className="stat-value">{metrics.total}</span><span className="stat-label">Total Leads</span></div>
          <div className="stat-card"><span className="stat-value">{metrics.demos}</span><span className="stat-label">Demo Requests</span></div>
          <div className="stat-card"><span className="stat-value">{metrics.newsletter}</span><span className="stat-label">Newsletter</span></div>
          <div className="stat-card"><span className="stat-value">{metrics.open}</span><span className="stat-label">Open Leads</span></div>
        </div>

        <div className="leads-toolbar">
          <label className="leads-field">
            Search
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, company, email..."
            />
          </label>
          <label>
            Type
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {typeOptions.map((option) => (
                <option key={option.label} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All</option>
              {statusOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <button type="button" className="secondary-action" onClick={exportCsv} disabled={filteredLeads.length === 0}>
            Export CSV
          </button>
        </div>

        {message ? <p className="form-success" style={{ marginTop: '0.75rem' }}>{message}</p> : null}
      </div>

      <div className="panel leads-table-panel" style={{ marginTop: '1rem' }}>
        {loading ? (
          <p>Loading leads...</p>
        ) : filteredLeads.length === 0 ? (
          <p>No leads found for the selected filters.</p>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Phone</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead._id}>
                    <td>{new Date(lead.createdAt).toLocaleString()}</td>
                    <td><span className={`badge ${lead.type}`}>{lead.type.replaceAll('_', ' ')}</span></td>
                    <td>{lead.name || '-'}</td>
                    <td>{lead.email}</td>
                    <td>{lead.company || '-'}</td>
                    <td>{lead.phone || '-'}</td>
                    <td>
                      <select value={lead.status} onChange={(e) => updateStatus(lead._id, e.target.value)} className={`lead-status status-${lead.status}`}>
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </td>
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
