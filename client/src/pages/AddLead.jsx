import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLead } from '../api/leadsApi';
import LeadForm from '../components/LeadForm';
import { useToast } from '../components/Toast';

function AddLead() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);

  const handleSubmit = async (leadData) => {
    setSubmitting(true);
    setServerErrors(null);
    try {
      const res = await createLead(leadData);
      if (res.success) {
        showToast('Lead created successfully', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setServerErrors(err.response.data.errors);
        showToast('Please fix the validation errors.', 'error');
      } else if (err.response?.status === 409) {
        setServerErrors({ email: 'A lead with this email address already exists.' });
        showToast('A lead with this email address already exists.', 'error');
      } else {
        const errorMsg = err.response?.data?.message || 'An error occurred while creating the lead.';
        showToast(errorMsg, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Add New Lead</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Create a new sales pipeline entry
        </p>
      </div>
      <div className="card" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <LeadForm
          mode="add"
          onSubmit={handleSubmit}
          serverErrors={serverErrors}
          submitting={submitting}
        />
      </div>
    </div>
  );
}

export default AddLead;
