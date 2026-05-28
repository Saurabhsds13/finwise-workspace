import { useState, FormEvent } from 'react';
import './contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    // TODO: Wire to backend email service
    setSuccess('Thank you for reaching out! We will get back to you within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p className="page-subtitle">Have questions or feedback? We'd love to hear from you.</p>
      </div>

      <div className="contact-grid">
        {/* Contact Form */}
        <div className="contact-form-card">
          <h2>Send us a message</h2>

          {success && <div className="contact-success">✅ {success}</div>}
          {error && <div className="contact-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row-inline">
              <div className="form-group">
                <label htmlFor="contact-name">Name *</label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Email *</label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                type="text"
                placeholder="What's this about?"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-message">Message *</label>
              <textarea
                id="contact-message"
                placeholder="Tell us more..."
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn-primary">Send Message</button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="contact-info">
          <div className="info-card">
            <span className="info-icon">📧</span>
            <h3>Email</h3>
            <p>support@finwise.app</p>
          </div>

          <div className="info-card">
            <span className="info-icon">📍</span>
            <h3>Location</h3>
            <p>Mumbai, India</p>
          </div>

          <div className="info-card">
            <span className="info-icon">⏰</span>
            <h3>Support Hours</h3>
            <p>Mon - Fri, 9:00 AM - 6:00 PM IST</p>
          </div>

          <div className="info-card">
            <span className="info-icon">💬</span>
            <h3>Response Time</h3>
            <p>Within 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
