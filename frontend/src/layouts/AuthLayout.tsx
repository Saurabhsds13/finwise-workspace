import { Outlet } from 'react-router-dom';

/**
 * Layout wrapper for authentication pages.
 * Provides a centered container without sidebar/header.
 */
function AuthLayout() {
  return (
    <div className="auth-layout">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
