import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateMyProfile } from '../api/leadsApi';
import { useToast } from '../components/Toast';
import '../styles/profile.css';

function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const { showToast } = useToast();

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password Update State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Formatting Member Date
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'N/A';

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!name.trim()) {
      setProfileError('Name is required');
      return;
    }

    if (name.trim().length < 2) {
      setProfileError('Name must be at least 2 characters');
      return;
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setProfileError('Please enter a valid email address');
        return;
      }
    }

    setIsSavingProfile(true);
    try {
      const updateData = { name: name.trim() };
      // Email is optional in User schema
      updateData.email = email.trim() ? email.trim().toLowerCase() : '';

      const res = await updateMyProfile(updateData);
      if (res.success && res.data) {
        updateUser(res.data);
        setProfileSuccess('Profile updated successfully!');
        showToast('Profile updated successfully!', 'success');
      } else {
        setProfileError(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Update profile error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setProfileError(err.response.data.message);
      } else {
        setProfileError('Failed to update profile. Server error.');
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Current password is required');
      return;
    }

    if (!newPassword) {
      setPasswordError('New password is required');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError('New password cannot be the same as current password');
      return;
    }

    if (confirmPassword !== newPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await updateMyProfile({
        currentPassword,
        newPassword
      });

      if (res.success) {
        setPasswordSuccess('Password updated successfully!');
        showToast('Password updated successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(res.message || 'Failed to update password.');
      }
    } catch (err) {
      console.error('Update password error:', err);
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.errors && data.errors.currentPassword) {
          setPasswordError(data.errors.currentPassword);
        } else if (data.message) {
          setPasswordError(data.message);
        } else {
          setPasswordError('Password update failed.');
        }
      } else {
        setPasswordError('Failed to update password. Server error.');
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const initialLetter = user?.name ? user.name.trim().charAt(0).toUpperCase() : 'U';

  return (
    <div className="profile-container">
      <div className="profile-back-row">
        <Link to="/dashboard" className="profile-back-link">
          ← Back to Dashboard
        </Link>
      </div>
      <div className="profile-card">
        {/* SECTION 1: PROFILE HEADER */}
        <div className="profile-header">
          <div className="profile-header-left">
            <div className="profile-avatar">{initialLetter}</div>
            <div className="profile-meta">
              <h1 className="profile-name">{user?.name}</h1>
              <p className="profile-username">@{user?.username}</p>
              <p className="profile-joined">Member since {memberSince}</p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-danger btn-sign-out"
            onClick={logout}
          >
            Sign Out
          </button>
        </div>

        <hr className="profile-divider" />

        {/* PROFILE COLUMN GRID */}
        <div className="profile-grid">
          {/* SECTION 2: EDIT PROFILE */}
          <div className="profile-section">
            <h2 className="section-title">Edit Profile</h2>
            {profileError && <div className="alert alert-error">{profileError}</div>}
            {profileSuccess && <div className="alert alert-success">{profileSuccess}</div>}
            
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  disabled={isSavingProfile}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="emailAddress" className="form-label">Email Address (optional)</label>
                <input
                  id="emailAddress"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={isSavingProfile}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-save"
                disabled={isSavingProfile}
              >
                {isSavingProfile ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </form>
          </div>

          <div className="profile-column-divider"></div>

          {/* SECTION 3: CHANGE PASSWORD */}
          <div className="profile-section">
            <h2 className="section-title">Change Password</h2>
            {passwordError && <div className="alert alert-error">{passwordError}</div>}
            {passwordSuccess && <div className="alert alert-success">{passwordSuccess}</div>}

            <form onSubmit={handlePasswordSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="currentPass" className="form-label">Current Password</label>
                <input
                  id="currentPass"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isUpdatingPassword}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPass" className="form-label">New Password</label>
                <input
                  id="newPass"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isUpdatingPassword}
                  required
                />
                <span className="input-hint">Minimum 6 characters</span>
              </div>

              <div className="form-group">
                <label htmlFor="confirmNewPass" className="form-label">Confirm New Password</label>
                <input
                  id="confirmNewPass"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isUpdatingPassword}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-save"
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
