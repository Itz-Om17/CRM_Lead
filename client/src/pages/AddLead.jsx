import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLead } from '../api/leadsApi';
import LeadForm from '../components/LeadForm';

function AddLead() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);

  const handleSubmit = async (leadData) => {
    setSubmitting(true);
    setServerErrors(null);
    try {
      const res = await createLead(leadData);
      if (res.success) {
        navigate('/');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setServerErrors(err.response.data.errors);
      } else if (err.response?.status === 409) {
        setServerErrors({ email: 'A lead with this email address already exists.' });
      } else {
        alert(err.response?.data?.message || 'An error occurred while creating the lead.');
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
