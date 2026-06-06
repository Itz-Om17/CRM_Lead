import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateLead } from '../api/leadsApi';
import { useToast } from './Toast';
import StatusBadge from './StatusBadge';
import '../styles/lead_detail_modal.css';

const STATUS_OPTIONS = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

function LeadDetailModal({ lead, onClose, onUpdated, onDeleteClick, initialEdit }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const overlayRef = useRef(null);
  const firstFocusRef = useRef(null);

  const [isEditing, setIsEditing] = useState(initialEdit || false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  // Editable form state
  const [form, setForm] = useState({
    name: lead.name || '',
    email: lead.email || '',
    phone: lead.phone || '',
    company: lead.company || '',
    status: lead.status || 'New',
    notes: lead.notes || ''
  });
  const [fieldErrors, setFieldErrors] = useState({});

  // Determine ownership
  const creatorId = lead.createdBy?._id || lead.createdBy;
  const isOwner = user && String(creatorId) === String(user._id);

  const creatorName = lead.createdBy?.name || lead.createdBy?.username || '—';

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    // Focus trap: focus the close button on mount
    if (firstFocusRef.current) firstFocusRef.current.focus();
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    if (!form.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    if (!form.company.trim()) {
      errors.company = 'Company is required';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setServerError('');
    try {
      const res = await updateLead(lead._id, {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        company: form.company.trim(),
        status: form.status,
        notes: form.notes.trim()
      });
      if (res.success) {
        showToast('Lead updated successfully', 'success');
        setIsEditing(false);
        onUpdated(); // refresh the table
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update lead.';
      setServerError(msg);
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (initialEdit) {
      onClose();
    } else {
      setIsEditing(false);
      setServerError('');
      setFieldErrors({});
      setForm({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        status: lead.status || 'New',
        notes: lead.notes || ''
      });
    }
  };

  const formatDate = (ds) => {
    if (!ds) return '—';
    return new Date(ds).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div
      className="ldm-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Lead Details"
    >
      <div className="ldm-panel">
        {/* ── HEADER ── */}
        <div className="ldm-header">
          <div className="ldm-header-left">
            <h2 className="ldm-title">Lead Details</h2>
            {!isEditing && (
              <StatusBadge status={lead.status} />
            )}
          </div>
          <button
            className="ldm-close-btn"
            onClick={onClose}
            ref={firstFocusRef}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* ── OWNER BADGE ── */}
        <div className="ldm-owner-bar">
          <span className="ldm-owner-label">Managed by</span>
          <span className={`ldm-owner-value ${isOwner ? 'ldm-owner-you' : ''}`}>
            {isOwner ? `You (${user.name})` : creatorName}
          </span>
          {!isOwner && (
            <span className="ldm-readonly-badge">View Only</span>
          )}
        </div>

        {serverError && (
          <div className="ldm-server-error">{serverError}</div>
        )}

        {/* ── BODY ── */}
        <div className="ldm-body">
          {isEditing ? (
            /* ─ EDIT MODE ─ */
            <div className="ldm-form">
              <div className="ldm-form-row">
                <div className="ldm-field">
                  <label className="ldm-label">Full Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={fieldErrors.name ? 'ldm-input error' : 'ldm-input'}
                    placeholder="Lead name"
                  />
                  {fieldErrors.name && <span className="ldm-field-error">{fieldErrors.name}</span>}
                </div>
                <div className="ldm-field">
                  <label className="ldm-label">Company *</label>
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className={fieldErrors.company ? 'ldm-input error' : 'ldm-input'}
                    placeholder="Company name"
                  />
                  {fieldErrors.company && <span className="ldm-field-error">{fieldErrors.company}</span>}
                </div>
              </div>

              <div className="ldm-form-row">
                <div className="ldm-field">
                  <label className="ldm-label">Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className={fieldErrors.email ? 'ldm-input error' : 'ldm-input'}
                    placeholder="email@example.com"
                  />
                  {fieldErrors.email && <span className="ldm-field-error">{fieldErrors.email}</span>}
                </div>
                <div className="ldm-field">
                  <label className="ldm-label">Phone *</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={fieldErrors.phone ? 'ldm-input error' : 'ldm-input'}
                    placeholder="Phone number"
                  />
                  {fieldErrors.phone && <span className="ldm-field-error">{fieldErrors.phone}</span>}
                </div>
              </div>

              <div className="ldm-field">
                <label className="ldm-label">Pipeline Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="ldm-input"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="ldm-field">
                <label className="ldm-label">Notes</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="ldm-input ldm-textarea"
                  placeholder="Add any notes about this lead..."
                  rows={3}
                  maxLength={500}
                />
                <span className="ldm-char-count">{form.notes.length}/500</span>
              </div>
            </div>
          ) : (
            /* ─ VIEW MODE ─ */
            <div className="ldm-detail-grid">
              <div className="ldm-detail-item">
                <span className="ldm-detail-label">Full Name</span>
                <span className="ldm-detail-value">{lead.name}</span>
              </div>
              <div className="ldm-detail-item">
                <span className="ldm-detail-label">Company</span>
                <span className="ldm-detail-value">{lead.company}</span>
              </div>
              <div className="ldm-detail-item">
                <span className="ldm-detail-label">Email</span>
                <a href={`mailto:${lead.email}`} className="ldm-link">{lead.email}</a>
              </div>
              <div className="ldm-detail-item">
                <span className="ldm-detail-label">Phone</span>
                <span className="ldm-detail-value">{lead.phone || '—'}</span>
              </div>
              <div className="ldm-detail-item">
                <span className="ldm-detail-label">Pipeline Status</span>
                <StatusBadge status={lead.status} />
              </div>
              <div className="ldm-detail-item">
                <span className="ldm-detail-label">Lead Added</span>
                <span className="ldm-detail-value">{formatDate(lead.createdAt)}</span>
              </div>
              <div className="ldm-detail-item ldm-detail-full">
                <span className="ldm-detail-label">Notes</span>
                <span className="ldm-detail-value ldm-notes-text">
                  {lead.notes || <em style={{ color: 'var(--text-secondary)' }}>No notes added</em>}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER ACTIONS ── */}
        <div className="ldm-footer">
          {isOwner ? (
            isEditing ? (
              <>
                <button
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-danger"
                  onClick={() => { onClose(); onDeleteClick(lead); }}
                >
                  Delete Lead
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Lead
                </button>
              </>
            )
          ) : (
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeadDetailModal;
