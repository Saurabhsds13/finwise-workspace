import './privacy.css';

function PrivacyPolicy() {
  return (
    <div className="privacy-page">
      <div className="privacy-hero">
        <h1>Privacy Policy</h1>
        <p className="privacy-tagline">
          How we protect and use your data
        </p>
      </div>

      <section className="privacy-section">
        <h2>1. Introduction</h2>
        <p>
          At FinWise, we take your privacy seriously. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you use our
          AI-powered financial management platform. By using FinWise, you agree to the
          collection and use of information in accordance with this policy.
        </p>
      </section>

      <section className="privacy-section">
        <h2>2. Information We Collect</h2>
        <div className="privacy-list">
          <div className="privacy-item">
            <h3>Personal Information</h3>
            <p>Name, email address, and profile information you provide during registration.</p>
          </div>
          <div className="privacy-item">
            <h3>Financial Data</h3>
            <p>Expenses, budgets, savings goals, and transaction details you enter into the platform.</p>
          </div>
          <div className="privacy-item">
            <h3>Usage Data</h3>
            <p>Information about how you interact with our services, including access times and features used.</p>
          </div>
          <div className="privacy-item">
            <h3>Device Information</h3>
            <p>Device type, operating system, and browser information for security and optimization.</p>
          </div>
        </div>
      </section>

      <section className="privacy-section">
        <h2>3. How We Use Your Information</h2>
        <ul className="usage-list">
          <li>Provide and maintain our financial management services</li>
          <li>Generate AI-powered insights and recommendations based on your spending patterns</li>
          <li>Improve our platform and user experience</li>
          <li>Send important updates about your account and our services</li>
          <li>Detect and prevent fraud, unauthorized access, and other illegal activities</li>
          <li>Comply with legal obligations and enforce our terms of service</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2>4. Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your data, including:
        </p>
        <div className="security-grid">
          <div className="security-item">
            <span className="security-icon">🔐</span>
            <span>Bank-grade encryption for all data in transit and at rest</span>
          </div>
          <div className="security-item">
            <span className="security-icon">🗝️</span>
            <span>Secure password hashing using BCrypt</span>
          </div>
          <div className="security-item">
            <span className="security-icon">🔑</span>
            <span>JWT-based authentication with secure token management</span>
          </div>
          <div className="security-item">
            <span className="security-icon">🛡️</span>
            <span>Regular security audits and vulnerability assessments</span>
          </div>
        </div>
      </section>

      <section className="privacy-section">
        <h2>5. Data Sharing and Disclosure</h2>
        <p>
          We do not sell your personal information. We may share your data only in the
          following circumstances:
        </p>
        <ul className="usage-list">
          <li>With service providers who assist in operating our platform</li>
          <li>To comply with legal requirements, court orders, or government requests</li>
          <li>To protect our rights, privacy, safety, or property</li>
          <li>In connection with a merger, acquisition, or sale of assets</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2>6. Your Rights</h2>
        <div className="rights-grid">
          <div className="right-item">
            <span className="right-icon">👁️</span>
            <div>
              <h3>Access</h3>
              <p>Request a copy of all data we hold about you</p>
            </div>
          </div>
          <div className="right-item">
            <span className="right-icon">✏️</span>
            <div>
              <h3>Correction</h3>
              <p>Request correction of inaccurate or incomplete data</p>
            </div>
          </div>
          <div className="right-item">
            <span className="right-icon">🗑️</span>
            <div>
              <h3>Deletion</h3>
              <p>Request deletion of your account and associated data</p>
            </div>
          </div>
          <div className="right-item">
            <span className="right-icon">📤</span>
            <div>
              <h3>Export</h3>
              <p>Export your data in a machine-readable format</p>
            </div>
          </div>
        </div>
      </section>

      <section className="privacy-section">
        <h2>7. Data Retention</h2>
        <p>
          We retain your personal information for as long as your account is active or
          as needed to provide you services. After account deletion, your data is
          permanently removed from our active systems within 30 days. Backup copies
          may persist for a limited period as required by our disaster recovery procedures.
        </p>
      </section>

      <section className="privacy-section">
        <h2>8. Cookies and Tracking</h2>
        <p>
          We use essential cookies to maintain your session and preferences. We do not
          use third-party tracking or advertising cookies. You can disable cookies in
          your browser settings, though some features may not function properly.
        </p>
      </section>

      <section className="privacy-section">
        <h2>9. Children's Privacy</h2>
        <p>
          FinWise is not intended for use by individuals under the age of 18. We do
          not knowingly collect personal information from children. If you believe
          we have collected information from a child, please contact us immediately.
        </p>
      </section>

      <section className="privacy-section">
        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of
          any material changes by posting the new policy on this page and updating
          the "Last Updated" date. We encourage you to review this policy periodically.
        </p>
      </section>

      <section className="privacy-section">
        <h2>11. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or our data practices,
          please contact us at:
        </p>
        <div className="contact-box">
          <p><strong>Email:</strong> privacy@finwise.app</p>
          <p><strong>Address:</strong> India</p>
        </div>
      </section>

      <div className="privacy-footer">
        <p>Last Updated: May 2026</p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;