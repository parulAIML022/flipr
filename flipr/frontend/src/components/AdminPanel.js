import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getProjects,
  addProject,
  getClients,
  addClient,
  getContacts,
  getNewsletterSubscriptions,
} from '../services/api';
import ImageCropper from './ImageCropper';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('projects');
  
  // Projects state
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    image: null,
  });

  // Clients state
  const [clients, setClients] = useState([]);
  const [clientForm, setClientForm] = useState({
    name: '',
    description: '',
    designation: '',
    image: null,
  });

  // Contacts state
  const [contacts, setContacts] = useState([]);

  // Newsletter state
  const [newsletter, setNewsletter] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Image cropper state
  const [showCropper, setShowCropper] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState(null);
  const [cropperType, setCropperType] = useState(null); // 'project' or 'client'

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [projectsRes, clientsRes, contactsRes, newsletterRes] = await Promise.all([
        getProjects(),
        getClients(),
        getContacts(),
        getNewsletterSubscriptions(),
      ]);
      setProjects(projectsRes.data);
      setClients(clientsRes.data);
      setContacts(contactsRes.data);
      setNewsletter(newsletterRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleProjectImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropperImageSrc(reader.result);
        setCropperType('project');
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClientImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropperImageSrc(reader.result);
        setCropperType('client');
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedBlob) => {
    // Convert blob to File object
    const file = new File([croppedBlob], `cropped-${Date.now()}.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });

    if (cropperType === 'project') {
      setProjectForm({ ...projectForm, image: file });
    } else if (cropperType === 'client') {
      setClientForm({ ...clientForm, image: file });
    }

    setShowCropper(false);
    setCropperImageSrc(null);
    setCropperType(null);
  };

  const handleCropperClose = () => {
    const type = cropperType; // Store before clearing
    setShowCropper(false);
    setCropperImageSrc(null);
    setCropperType(null);
    // Reset file input
    if (type === 'project') {
      document.getElementById('project-image').value = '';
    } else if (type === 'client') {
      document.getElementById('client-image').value = '';
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectForm.image) {
      showMessage('error', 'Please select and crop an image');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', projectForm.name);
      formData.append('description', projectForm.description);
      formData.append('image', projectForm.image);

      await addProject(formData);
      showMessage('success', 'Project added successfully!');
      setProjectForm({ name: '', description: '', image: null });
      document.getElementById('project-image').value = '';
      fetchAllData();
    } catch (error) {
      showMessage('error', error.response?.data?.error || 'Failed to add project');
    }
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    if (!clientForm.image) {
      showMessage('error', 'Please select and crop an image');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', clientForm.name);
      formData.append('description', clientForm.description);
      formData.append('designation', clientForm.designation);
      formData.append('image', clientForm.image);

      await addClient(formData);
      showMessage('success', 'Client added successfully!');
      setClientForm({ name: '', description: '', designation: '', image: null });
      document.getElementById('client-image').value = '';
      fetchAllData();
    } catch (error) {
      showMessage('error', error.response?.data?.error || 'Failed to add client');
    }
  };

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div className="container">
          <div className="admin-nav">
            <h1 className="admin-title">Admin Panel</h1>
            <Link to="/" className="btn btn-secondary">Back to Home</Link>
          </div>
        </div>
      </header>

      <div className="container admin-container">
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
          <button
            className={`tab ${activeTab === 'clients' ? 'active' : ''}`}
            onClick={() => setActiveTab('clients')}
          >
            Clients
          </button>
          <button
            className={`tab ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            Contact Forms
          </button>
          <button
            className={`tab ${activeTab === 'newsletter' ? 'active' : ''}`}
            onClick={() => setActiveTab('newsletter')}
          >
            Newsletter Subscriptions
          </button>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="tab-content">
            <div className="admin-section">
              <h2>Add New Project</h2>
              <form className="admin-form" onSubmit={handleProjectSubmit}>
                <div className="form-group">
                  <label>Project Name</label>
                  <input
                    type="text"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    required
                    rows="4"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Project Image (will be cropped to 450x350 ratio)</label>
                  <input
                    id="project-image"
                    type="file"
                    accept="image/*"
                    onChange={handleProjectImageSelect}
                    required
                  />
                  {projectForm.image && (
                    <p className="image-selected-text">Image selected: {projectForm.image.name}</p>
                  )}
                </div>
                <button type="submit" className="btn btn-primary">Add Project</button>
              </form>
            </div>

            <div className="admin-section">
              <h2>All Projects ({projects.length})</h2>
              {loading ? (
                <div className="loading">Loading...</div>
              ) : projects.length === 0 ? (
                <div className="empty-state">No projects added yet.</div>
              ) : (
                <div className="admin-grid">
                  {projects.map((project) => {
                    const imageSrc = project.image.startsWith('http') 
                      ? project.image 
                      : `http://localhost:5001${project.image}`;
                    
                    return (
                      <div key={project.id} className="admin-card">
                        <img
                          src={imageSrc}
                          alt={project.name}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=Project+Image';
                          }}
                        />
                      <div className="admin-card-content">
                        <h3>{project.name}</h3>
                        <p>{project.description}</p>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div className="tab-content">
            <div className="admin-section">
              <h2>Add New Client</h2>
              <form className="admin-form" onSubmit={handleClientSubmit}>
                <div className="form-group">
                  <label>Client Name</label>
                  <input
                    type="text"
                    value={clientForm.name}
                    onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={clientForm.description}
                    onChange={(e) => setClientForm({ ...clientForm, description: e.target.value })}
                    required
                    rows="4"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Designation</label>
                  <input
                    type="text"
                    value={clientForm.designation}
                    onChange={(e) => setClientForm({ ...clientForm, designation: e.target.value })}
                    placeholder="e.g., CEO, Web Developer, Designer"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Client Image (will be cropped to 450x350 ratio)</label>
                  <input
                    id="client-image"
                    type="file"
                    accept="image/*"
                    onChange={handleClientImageSelect}
                    required
                  />
                  {clientForm.image && (
                    <p className="image-selected-text">Image selected: {clientForm.image.name}</p>
                  )}
                </div>
                <button type="submit" className="btn btn-primary">Add Client</button>
              </form>
            </div>

            <div className="admin-section">
              <h2>All Clients ({clients.length})</h2>
              {loading ? (
                <div className="loading">Loading...</div>
              ) : clients.length === 0 ? (
                <div className="empty-state">No clients added yet.</div>
              ) : (
                <div className="admin-grid">
                  {clients.map((client) => {
                    const imageSrc = client.image.startsWith('http') 
                      ? client.image 
                      : `http://localhost:5001${client.image}`;
                    
                    return (
                      <div key={client.id} className="admin-card">
                        <img
                          src={imageSrc}
                          alt={client.name}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200x200?text=Client+Image';
                          }}
                        />
                      <div className="admin-card-content">
                        <h3>{client.name}</h3>
                        <p className="designation">{client.designation}</p>
                        <p>{client.description}</p>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="tab-content">
            <div className="admin-section">
              <h2>Contact Form Submissions ({contacts.length})</h2>
              {loading ? (
                <div className="loading">Loading...</div>
              ) : contacts.length === 0 ? (
                <div className="empty-state">No contact submissions yet.</div>
              ) : (
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Mobile Number</th>
                        <th>City</th>
                        <th>Submitted At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((contact) => (
                        <tr key={contact.id}>
                          <td>{contact.full_name}</td>
                          <td>{contact.email}</td>
                          <td>{contact.mobile_number}</td>
                          <td>{contact.city}</td>
                          <td>{new Date(contact.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Newsletter Tab */}
        {activeTab === 'newsletter' && (
          <div className="tab-content">
            <div className="admin-section">
              <h2>Newsletter Subscriptions ({newsletter.length})</h2>
              {loading ? (
                <div className="loading">Loading...</div>
              ) : newsletter.length === 0 ? (
                <div className="empty-state">No newsletter subscriptions yet.</div>
              ) : (
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Email Address</th>
                        <th>Subscribed At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newsletter.map((subscription) => (
                        <tr key={subscription.id}>
                          <td>{subscription.email}</td>
                          <td>{new Date(subscription.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Image Cropper Modal */}
      {showCropper && cropperImageSrc && (
        <ImageCropper
          imageSrc={cropperImageSrc}
          onCropComplete={handleCropComplete}
          onClose={handleCropperClose}
          aspectRatio={450 / 350}
        />
      )}
    </div>
  );
};

export default AdminPanel;

