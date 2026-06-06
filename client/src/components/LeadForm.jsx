import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/form.css';

function LeadForm({ mode = 'add', initialData = null, onSubmit = null, serverErrors = null, submitting = false }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'New',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        company: initialData.company || '',
        status: initialData.status || 'New',
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (serverErrors) {
      setErrors((prev) => ({ ...prev, ...serverErrors }));
    }
  }, [serverErrors]);

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) {
      tempErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      tempErrors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        tempErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    }

    if (!formData.company.trim()) {
      tempErrors.company = 'Company name is required';
    }

    if (formData.notes && formData.notes.trim().length > 500) {
      tempErrors.notes = 'Notes cannot exceed 500 characters';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate() && onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Full Name <span className="required-star">*</span></label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'input-error' : ''}
          placeholder="e.g. Jane Smith"
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address <span className="required-star">*</span></label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'input-error' : ''}
          placeholder="e.g. jane@company.com"
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div className="form-group-row">
        <div className="form-group flex-1">
          <label htmlFor="phone">Phone <span className="required-star">*</span></label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? 'input-error' : ''}
            placeholder="e.g. 555-0123"
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        <div className="form-group flex-1">
          <label htmlFor="company">Company <span className="required-star">*</span></label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={errors.company ? 'input-error' : ''}
            placeholder="e.g. Apple Inc."
          />
          {errors.company && <span className="error-text">{errors.company}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="status">Lead Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Converted">Converted</option>
          <option value="Lost">Lost</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes (Optional)</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="4"
          className={errors.notes ? 'input-error' : ''}
          placeholder="Enter notes about the customer or pipeline progress..."
        />
        {errors.notes && <span className="error-text">{errors.notes}</span>}
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/dashboard')}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? 'Saving...' : mode === 'edit' ? 'Update Lead' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
}

export default LeadForm;
