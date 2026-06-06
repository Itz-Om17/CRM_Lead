import React from 'react';
import { useAuth } from '../context/AuthContext';
import StatusBadge from './StatusBadge';
import '../styles/table.css';

function LeadTable({ leads, onRowClick, onDeleteClick }) {
  const { user } = useAuth();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatPhone = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const getCreatorDisplay = (lead) => {
    const cb = lead.createdBy;
    if (!cb) return '—';
    if (typeof cb === 'object') {
      return cb.name || cb.username || '—';
    }
    return '—';
  };

  const isOwner = (lead) => {
    const cb = lead.createdBy;
    if (!cb || !user) return false;
    const ownerId = typeof cb === 'object' ? cb._id : cb;
    return String(ownerId) === String(user._id);
  };

  return (
    <div className="table-responsive">
      <table className="lead-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Created</th>
            <th>Managed By</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const owner = isOwner(lead);
            return (
              <tr
                key={lead._id}
                className="lead-row"
                onClick={() => onRowClick(lead, false)}
                title="Click to view details"
              >
                <td className="lead-name-cell">{lead.name}</td>
                <td className="email-cell" title={lead.email}>{lead.email}</td>
                <td className="phone-cell">{formatPhone(lead.phone)}</td>
                <td className="company-cell" title={lead.company}>{lead.company}</td>
                <td><StatusBadge status={lead.status} /></td>
                <td className="notes-cell" title={lead.notes}>
                  {lead.notes || '—'}
                </td>
                <td className="created-cell">{formatDate(lead.createdAt)}</td>
                <td className="managed-cell">
                  <span className={`managed-by-tag ${owner ? 'managed-by-me' : ''}`}>
                    {owner ? 'You' : getCreatorDisplay(lead)}
                  </span>
                </td>
                <td
                  className="actions-cell"
                  style={{ textAlign: 'right' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                    {owner && (
                      <>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRowClick(lead, true);
                          }}
                          title="Edit this lead"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={(e) => { e.stopPropagation(); onDeleteClick(lead); }}
                          title="Delete this lead"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default LeadTable;
