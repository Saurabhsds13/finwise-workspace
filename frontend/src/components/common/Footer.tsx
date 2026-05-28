import { Link } from 'react-router-dom';
import './footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo">FinWise</span>
          <p className="footer-tagline">AI-powered financial management</p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h4>Product</h4>
            <Link to="/">Dashboard</Link>
            <Link to="/expenses">Expenses</Link>
            <Link to="/budget">Budget</Link>
            <Link to="/goals">Goals</Link>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer-column">
            <h4>Features</h4>
            <Link to="/analytics">Analytics</Link>
            <Link to="/ai-advisor">AI Advisor</Link>
            <Link to="/settings">Settings</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} FinWise. All rights reserved.</p>
        <p className="footer-made">Made with ❤️ in India</p>
      </div>
    </footer>
  );
}

export default Footer;
