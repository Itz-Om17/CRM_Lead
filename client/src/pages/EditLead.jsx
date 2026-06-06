import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getLeadById, updateLead } from '../api/leadsApi';
import LeadForm from '../components/LeadForm';
import Loader from '../components/Loader';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

function EditLead() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);

  useEffect(() => {
    const fetchLead = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getLeadById(id);
        if (res.success) {
          const fetchedLead = res.data;
          const creatorId = fetchedLead.createdBy?._id || fetchedLead.createdBy;
          if (user && String(creatorId) !== String(user._id)) {
            setError('You are not authorized to modify this lead.');
            showToast('You are not authorized to modify this lead.', 'error');
          } else {
            setLead(fetchedLead);
          }
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to fetch the lead details.';
        setError(msg);
        showToast(msg, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id, showToast, user]);

  const handleSubmit = async (leadData) => {
    setSubmitting(true);
    setServerErrors(null);
    try {
      const res = await updateLead(id, leadData);
      if (res.success) {
        showToast('Lead updated successfully', 'success');
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
        const errorMsg = err.response?.data?.message || 'An error occurred while updating the lead.';
        showToast(errorMsg, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Edit Lead</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Modify pipeline lead information
        </p>
      </div>

      {loading ? (
        <Loader message="Loading lead details..." />
      ) : error ? (
        <div className="card" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: 'var(--color-danger)', marginBottom: '1.5rem' }}>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      ) : (
        <div className="card" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <LeadForm
            mode="edit"
            initialData={lead}
            onSubmit={handleSubmit}
            serverErrors={serverErrors}
            submitting={submitting}
          />
        </div>
      )}
    </div>
  );
}

export default EditLead;
