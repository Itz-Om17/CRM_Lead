import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLeadStats } from '../api/leadsApi';
import '../styles/landing.css';

function LandingPage() {
  const { token } = useAuth();
  const [totalLeads, setTotalLeads] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getLeadStats();
        if (res.success) {
          setTotalLeads(res.data.total);
        }
      } catch (err) {
        console.error('Failed to fetch lead stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="landing-page">
      {/* SECTION 1 — NAVBAR */}
      <header className="landing-navbar">
        <div className="landing-navbar-container">
          <div className="landing-brand">LeadFlow</div>
          <nav className="landing-nav-links">
            {token ? (
              <Link to="/dashboard" className="btn-landing-primary">Back to Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn-landing-outline">Sign In</Link>
                <Link to="/register" className="btn-landing-primary">Get Started</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* SECTION 2 — HERO */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-label">LEAD MANAGEMENT SIMPLIFIED</span>
            <h1 className="hero-headline">Turn every prospect into a customer</h1>
            <p className="hero-subheadline">
              LeadFlow gives your team one place to track, manage, and convert leads — from first contact to closed deal.
            </p>
            <div className="hero-cta-group">
              {token ? (
                <Link to="/dashboard" className="btn-hero-primary">Go to Dashboard</Link>
              ) : (
                <>
                  <Link to="/register" className="btn-hero-primary">Get Started Free</Link>
                  <Link to="/login" className="btn-hero-outline">Sign In</Link>
                </>
              )}
            </div>
          </div>
          <div className="hero-preview">
            <div className="browser-mockup">
              <div className="browser-header">
                <div className="browser-dots">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                </div>
                <div className="browser-address">app.leadflow.com/dashboard</div>
              </div>
              <div className="browser-body">
                {/* Fake Dashboard Header */}
                <div className="mock-db-header">
                  <div className="mock-db-title">Dashboard</div>
                  <div className="mock-db-user">Om Deshpande</div>
                </div>
                {/* Fake Stats Strip */}
                <div className="mock-stats">
                  <div className="mock-stat-card">
                    <div className="mock-stat-label">Total Leads</div>
                    <div className="mock-stat-value">124</div>
                  </div>
                  <div className="mock-stat-card">
                    <div className="mock-stat-label">Converted</div>
                    <div className="mock-stat-value">42</div>
                  </div>
                  <div className="mock-stat-card">
                    <div className="mock-stat-label">Win Rate</div>
                    <div className="mock-stat-value">33.8%</div>
                  </div>
                </div>
                {/* Fake Lead Table */}
                <div className="mock-table-container">
                  <table className="mock-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Company</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="semibold">John Doe</td>
                        <td>Acme Corp</td>
                        <td>
                          <span className="mock-badge badge-converted">Converted</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="semibold">Jane Smith</td>
                        <td>Wayne Enterprises</td>
                        <td>
                          <span className="mock-badge badge-contacted">Contacted</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="semibold">Bob Johnson</td>
                        <td>Stark Industries</td>
                        <td>
                          <span className="mock-badge badge-new">New</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — STATS STRIP */}
      <section className="stats-strip">
        <div className="stats-strip-container">
          <div className="stats-strip-item">
            <div className="stats-strip-number">
              {totalLeads !== null ? (totalLeads > 500 ? '500+' : totalLeads) : '...'}
            </div>
            <div className="stats-strip-label">Leads Tracked</div>
          </div>
          <div className="stats-strip-divider"></div>
          <div className="stats-strip-item">
            <div className="stats-strip-number">5</div>
            <div className="stats-strip-label">Pipeline Stages</div>
          </div>
          <div className="stats-strip-divider"></div>
          <div className="stats-strip-item">
            <div className="stats-strip-number">100%</div>
            <div className="stats-strip-label">Data Ownership</div>
          </div>
          <div className="stats-strip-divider"></div>
          <div className="stats-strip-item">
            <div className="stats-strip-number">0</div>
            <div className="stats-strip-label">Setup Cost</div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — FEATURES */}
      <section className="features-section" id="features">
        <div className="features-container">
          <h2 className="features-heading">Everything you need to manage leads</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
              </div>
              <h3 className="feature-title">Visual Pipeline Management</h3>
              <p className="feature-text">
                Track every lead through New, Contacted, Qualified, Converted, or Lost — always know where each deal stands.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h3 className="feature-title">Instant Search & Filtering</h3>
              <p className="feature-text">
                Find any lead in seconds. Filter by status, search by name, email or company, and sort by any column.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="feature-title">Your Leads, Your Data</h3>
              <p className="feature-text">
                Every lead belongs to the person who created it. Secure, role-aware access built in from the start.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — HOW IT WORKS */}
      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <h2 className="how-it-works-heading">Up and running in three steps</h2>
          <div className="steps-timeline">
            <div className="step-item">
              <div className="step-number">1</div>
              <h3 className="step-title">Create your account</h3>
              <p className="step-description">Sign up in seconds. No credit card, no setup wizard.</p>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <h3 className="step-title">Add your leads</h3>
              <p className="step-description">Enter lead details, set a status, and add notes.</p>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <h3 className="step-title">Track and convert</h3>
              <p className="step-description">Monitor progress, update statuses, close more deals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — CTA BANNER */}
      <section className="cta-banner-section">
        <div className="cta-banner-container">
          <h2 className="cta-banner-heading">Ready to organize your leads?</h2>
          <p className="cta-banner-subtext">Free to use. No credit card required.</p>
          {token ? (
            <Link to="/dashboard" className="btn-cta-banner">Go to Dashboard</Link>
          ) : (
            <Link to="/register" className="btn-cta-banner">Create Free Account</Link>
          )}
        </div>
      </section>

      {/* SECTION 7 — FOOTER */}
      <footer className="landing-footer">
        <div className="landing-footer-container">
          <div className="landing-footer-left">
            <h3 className="landing-footer-brand">LeadFlow</h3>
            <p className="landing-footer-tagline">Built for businesses.</p>
          </div>
          <div className="landing-footer-right">
            {token ? (
              <Link to="/dashboard" className="landing-footer-link">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="landing-footer-link">Sign In</Link>
                <Link to="/register" className="landing-footer-link">Create Account</Link>
              </>
            )}
          </div>
        </div>
        <div className="landing-footer-bottom">
          <p className="landing-footer-copyright">
            &copy; 2026 LeadFlow  — <a href="https://om-deshpande.vercel.app" target="_blank" rel="noopener noreferrer" className="footer-portfolio-link">Om Deshpande</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
