import { useState, FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { userService } from '../../services/userService';
import './settings.css';

function Settings() {
  const { user } = useAuth();
  const setUser = useAuthStore((state) => state.setUser);

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!profileData.firstName.trim() || !profileData.lastName.trim()) {
      setProfileError('Name fields cannot be empty');
      return;
    }

    setProfileLoading(true);
    try {
      const response = await userService.updateProfile({
        firstName: profileData.firstName.trim(),
        lastName: profileData.lastName.trim(),
      });

      // Update the store and localStorage so Header reflects the change
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setProfileSuccess('Profile updated successfully');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setProfileError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordData.currentPassword) {
      setPasswordError('Please enter your current password');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordSuccess('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; data?: { message?: string } } };
      if (error.response?.status === 401) {
        setPasswordError('Current password is incorrect');
      } else {
        setPasswordError(error.response?.data?.message || 'Failed to change password');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p className="page-subtitle">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <section className="settings-section">
        <h2>Profile Information</h2>
        <div className="settings-card">
          {profileSuccess && <div className="settings-success">✅ {profileSuccess}</div>}
          {profileError && <div className="settings-error">⚠️ {profileError}</div>}

          <form onSubmit={handleProfileSubmit} className="settings-form">
            <div className="form-row-inline">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => {
                    setProfileData({ ...profileData, firstName: e.target.value });
                    if (profileSuccess) setProfileSuccess('');
                  }}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => {
                    setProfileData({ ...profileData, lastName: e.target.value });
                    if (profileSuccess) setProfileSuccess('');
                  }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={profileData.email}
                disabled
                className="input-disabled"
              />
              <span className="form-hint">Email cannot be changed</span>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={profileLoading}>
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Password Section */}
      <section className="settings-section">
        <h2>Change Password</h2>
        <div className="settings-card">
          {passwordSuccess && <div className="settings-success">✅ {passwordSuccess}</div>}
          {passwordError && <div className="settings-error">⚠️ {passwordError}</div>}

          <form onSubmit={handlePasswordSubmit} className="settings-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                placeholder="Min. 8 characters"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                minLength={8}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmNewPassword">Confirm New Password</label>
              <input
                id="confirmNewPassword"
                type="password"
                placeholder="Re-enter new password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                minLength={8}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={passwordLoading}>
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="settings-section">
        <h2>Preferences</h2>
        <div className="settings-card">
          <div className="preference-item">
            <div className="preference-info">
              <span className="preference-label">Currency</span>
              <span className="preference-value">Indian Rupee (₹ INR)</span>
            </div>
          </div>

          <div className="preference-item">
            <div className="preference-info">
              <span className="preference-label">Date Format</span>
              <span className="preference-value">DD/MM/YYYY</span>
            </div>
          </div>

          <div className="preference-item">
            <div className="preference-info">
              <span className="preference-label">Default Budget Period</span>
              <span className="preference-value">Monthly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="settings-section">
        <h2 className="danger-title">Danger Zone</h2>
        <div className="settings-card danger-card">
          <div className="danger-item">
            <div>
              <span className="danger-label">Delete Account</span>
              <p className="danger-description">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <button className="btn-danger">Delete Account</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Settings;
