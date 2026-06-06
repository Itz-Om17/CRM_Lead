import React, { useState, useEffect, useCallback } from 'react';
import { getLeads, getLeadStats, deleteLead } from '../api/leadsApi';
import StatCard from '../components/StatCard';
import SearchBar from '../components/SearchBar';
import LeadTable from '../components/LeadTable';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import ConfirmModal from '../components/ConfirmModal';
import LeadDetailModal from '../components/LeadDetailModal';
import { useToast } from '../components/Toast';
import '../styles/dashboard.css';

function Dashboard() {
  const { showToast } = useToast();
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    New: 0,
    Contacted: 0,
    Qualified: 0,
    Converted: 0,
    Lost: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search, filter, sorting, pagination state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Confirm delete modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // Lead detail modal state
  const [detailLead, setDetailLead] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const res = await getLeadStats();
      if (res.success) setStats(res.data);
    } catch (err) {
      // Fail silently for stats
    }
  };

  // Fetch leads
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getLeads({ search, status, sortBy, order, page, limit: 10 });
      if (res.success) {
        setLeads(res.data.leads);
        setTotalPages(res.data.totalPages);
        setPage(res.data.page);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to connect to the backend server.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [search, status, sortBy, order, page, showToast]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);
  useEffect(() => { fetchStats(); }, []);

  const handleSearch = (query) => { setSearch(query); setPage(1); };
  const handleStatusFilter = (e) => { setStatus(e.target.value); setPage(1); };
  const handleSortChange = (e) => {
    const [field, sortOrder] = e.target.value.split(':');
    setSortBy(field);
    setOrder(sortOrder);
    setPage(1);
  };

  // Row click → open detail modal
  const handleRowClick = (lead, startInEditMode = false) => {
    setDetailLead(lead);
    setIsEditMode(startInEditMode);
  };

  // Detail modal closed
  const handleDetailClose = () => {
    setDetailLead(null);
    setIsEditMode(false);
  };

  // After an in-modal edit, refresh data
  const handleDetailUpdated = () => {
    setDetailLead(null);
    setIsEditMode(false);
    fetchLeads();
    fetchStats();
  };

  // Delete trigger (can come from table row or from inside the modal)
  const handleDeleteClick = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedLead) return;
    try {
      const res = await deleteLead(selectedLead._id);
      if (res.success) {
        setIsModalOpen(false);
        setSelectedLead(null);
        showToast('Lead deleted successfully', 'success');
        fetchLeads();
        fetchStats();
      }
    } catch (err) {
      setIsModalOpen(false);
      setSelectedLead(null);
      showToast(err.response?.data?.message || 'Error occurred while deleting the lead.', 'error');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Sales Pipeline</h1>
          <p className="dashboard-subtitle">Track and manage your team's leads</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Leads" value={stats.total} />
        <StatCard label="New" value={stats.New} status="New" />
        <StatCard label="Contacted" value={stats.Contacted} status="Contacted" />
        <StatCard label="Qualified" value={stats.Qualified} status="Qualified" />
        <StatCard label="Converted" value={stats.Converted} status="Converted" />
        <StatCard label="Lost" value={stats.Lost} status="Lost" />
      </div>

      <div className="controls-bar card">
        <div className="search-control">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="filter-controls">
          <select value={status} onChange={handleStatusFilter} aria-label="Filter by Status">
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>
          <select value={`${sortBy}:${order}`} onChange={handleSortChange} aria-label="Sort by">
            <option value="createdAt:desc">Created (Newest)</option>
            <option value="createdAt:asc">Created (Oldest)</option>
            <option value="name:asc">Name (A-Z)</option>
            <option value="name:desc">Name (Z-A)</option>
            <option value="company:asc">Company (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="error-box card">
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchLeads} style={{ marginTop: '1rem' }}>
              Retry
            </button>
          </div>
        ) : leads.length === 0 ? (
          <div className="empty-box card">
            <p>No leads found. Get started by adding a new lead!</p>
          </div>
        ) : (
          <>
            <LeadTable
              leads={leads}
              onRowClick={handleRowClick}
              onDeleteClick={handleDeleteClick}
            />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        title="Delete Lead"
        message={`Are you sure you want to delete the lead for "${selectedLead?.name}"? This action is permanent.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => { setIsModalOpen(false); setSelectedLead(null); }}
      />

      {/* Lead Detail / Edit Modal */}
      {detailLead && (
        <LeadDetailModal
          lead={detailLead}
          onClose={handleDetailClose}
          onUpdated={handleDetailUpdated}
          onDeleteClick={handleDeleteClick}
          initialEdit={isEditMode}
        />
      )}
    </div>
  );
}

export default Dashboard;
