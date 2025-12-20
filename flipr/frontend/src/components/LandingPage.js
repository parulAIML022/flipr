import React, { useState, useEffect } from 'react';
import { getProjects, getClients, submitContact, subscribeNewsletter } from '../services/api';
import './LandingPage.css';

const LandingPage = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    full_name: '',
    email: '',
    mobile_number: '',
    city: '',
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  
  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, clientsRes] = await Promise.all([
        getProjects(),
        getClients(),
      ]);
      setProjects(projectsRes.data);
      setClients(clientsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitContact(contactForm);
      setContactSubmitted(true);
      setContactForm({ full_name: '', email: '', mobile_number: '', city: '' });
      setTimeout(() => setContactSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Failed to submit contact form. Please try again.');
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      await subscribeNewsletter({ email: newsletterEmail });
      setNewsletterSubmitted(true);
      setNewsletterError('');
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubmitted(false), 5000);
    } catch (error) {
      setNewsletterError(error.response?.data?.error || 'Failed to subscribe. Please try again.');
    }
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <nav className="navbar">
            <div className="logo">
              <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Flipr</span>
            </div>
            <div className="nav-links">
              <a href="#home" className="nav-link">HOME</a>
              <a href="#services" className="nav-link">SERVICES</a>
              <a href="#projects" className="nav-link">ABOUT PROJECTS</a>
              <a href="#testimonials" className="nav-link">TESTIMONIALS</a>
            </div>
            <div className="header-actions">
              <a href="/admin" className="admin-link">ADMIN</a>
              <a href="#contact" className="contact-btn">CONTACT</a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section with Contact Form Overlay */}
      <section className="hero" id="home">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Consultation,</h1>
            <h1 className="hero-title">Design,</h1>
            <h1 className="hero-title">& Marketing</h1>
          </div>
          <div className="hero-contact-form">
            <h2 className="contact-form-title">Get a Free Consultation</h2>
            <form className="hero-form" onSubmit={handleContactSubmit}>
              <div className="hero-form-group">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={contactForm.full_name}
                  onChange={(e) => setContactForm({ ...contactForm, full_name: e.target.value })}
                  required
                  className="hero-input"
                />
              </div>
              <div className="hero-form-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                  className="hero-input"
                />
              </div>
              <div className="hero-form-group">
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={contactForm.mobile_number}
                  onChange={(e) => setContactForm({ ...contactForm, mobile_number: e.target.value })}
                  required
                  className="hero-input"
                />
              </div>
              <div className="hero-form-group">
                <input
                  type="text"
                  placeholder="City"
                  value={contactForm.city}
                  onChange={(e) => setContactForm({ ...contactForm, city: e.target.value })}
                  required
                  className="hero-input"
                />
              </div>
              {contactSubmitted && (
                <div className="success-message">Thank you! Your message has been submitted.</div>
              )}
              <button type="submit" className="hero-submit-btn">
                Get Quick Quote
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Our Projects Section */}
      <section className="section projects-section" id="projects">
        <div className="container">
          <h2 className="section-title">Our Projects</h2>
          {loading ? (
            <div className="loading">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="empty-state">No projects available yet.</div>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => {
                const imageSrc = project.image.startsWith('http') 
                  ? project.image 
                  : `http://localhost:5001${project.image}`;
                
                return (
                  <div key={project.id} className="project-card">
                    <div className="project-image">
                      <img 
                        src={imageSrc}
                        alt={project.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Project+Image';
                        }}
                      />
                    </div>
                    <div className="project-content">
                      <h3 className="project-name">{project.name}</h3>
                      <p className="project-description">{project.description}</p>
                      <button className="read-more-btn">READ MORE</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Happy Clients Section */}
      <section className="section clients-section" id="testimonials">
        <div className="container">
          <h2 className="section-title">Happy Clients</h2>
          {loading ? (
            <div className="loading">Loading clients...</div>
          ) : clients.length === 0 ? (
            <div className="empty-state">No clients available yet.</div>
          ) : (
            <div className="clients-grid">
              {clients.map((client) => {
                const imageSrc = client.image.startsWith('http') 
                  ? client.image 
                  : `http://localhost:5001${client.image}`;
                
                return (
                  <div key={client.id} className="client-card">
                    <div className="client-image">
                      <img 
                        src={imageSrc}
                        alt={client.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x200?text=Client+Image';
                        }}
                      />
                    </div>
                    <div className="client-content">
                      <p className="client-description">"{client.description}"</p>
                      <h3 className="client-name">{client.name}</h3>
                      <p className="client-designation">{client.designation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>


      {/* Newsletter Section */}
      <section className="section newsletter-section">
        <div className="container">
          <h2 className="section-title">Subscribe to Our Newsletter</h2>
          <p className="section-subtitle">Stay updated with our latest news and updates.</p>
          <div className="newsletter-wrapper">
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => {
                  setNewsletterEmail(e.target.value);
                  setNewsletterError('');
                }}
                required
                className="newsletter-input"
              />
              <button type="submit" className="btn btn-primary newsletter-btn">
                Subscribe
              </button>
            </form>
            {newsletterSubmitted && (
              <div className="success-message">Thank you for subscribing!</div>
            )}
            {newsletterError && (
              <div className="error-message">{newsletterError}</div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Flipr. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

