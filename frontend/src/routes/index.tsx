import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import GuestRoute from '../components/auth/GuestRoute';

// Auth pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// App pages
import Dashboard from '../pages/dashboard/Dashboard';
import Expenses from '../pages/expenses/Expenses';
import Budget from '../pages/budget/Budget';
import Goals from '../pages/goals/Goals';
import Analytics from '../pages/analytics/Analytics';
import AiAdvisor from '../pages/ai-advisor/AiAdvisor';
import Settings from '../pages/settings/Settings';
import About from '../pages/about/About';
import Contact from '../pages/contact/Contact';

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes (accessible only when NOT logged in) */}
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

      {/* Protected App Routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/ai-advisor" element={<AiAdvisor />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
