import React, { useState } from 'react';
import '../CSS/UserProfile.css'
import { Modal, Button } from 'react-bootstrap';
import edit from '../assets/pencil.png'
import axios from 'axios';

function CompanyInfo({ company, loading, displayButton }) {
  console.log("in companyInfo", company);
  const [showModal, setShowModal] = useState(false);

  const [editedCompany, setEditedCompany] = useState({
    name: company?.name || '',
    industry: company?.industry || '',
    location: company?.locations?.[0]?.address || '',
    logo: company?.logo || '', // Add logo field
    coverImage: company?.coverImage || '', // Add coverImage field
    tagline: company?.tagline || '', // Add tagline field
    overview: company?.overview || '', // Add overview field
    websiteURL: company?.websiteURL || '', // Add websiteURL field
    companySize: company?.companySize || '', // Add companySize field
    founded: company?.founded || '', // Add founded field
    specialties: company?.specialties?.join(', ') || '', // Add specialties field
  });
  // Function to handle opening the modal for editing user info
  const handleAddPost = () => {
    setShowModal(true);
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      setEditedCompany((prevState) => ({
        ...prevState,
        logo: base64Image,
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      setEditedCompany((prevState) => ({
        ...prevState,
        coverImage: base64Image,
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleEditCompanyInfo = async () => {
    try {
      // Send PUT request to update company data
      await axios.put(`/companyinfoupdate/${company._id}`, editedCompany);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating company:', error);
      // Handle error if needed
    }
  };
  const defaultCoverImage = 'https://t3.ftcdn.net/jpg/00/86/56/12/360_F_86561234_8HJdzg2iBlPap18K38mbyetKfdw1oNrm.jpg';

  
  return (
    <div>
      <br />
      {company && (
        <div className="row">
          <div className="col-lg-12 offset-lg-0 col-md-8 offset-md-2">

            <div className="user-info-container experience-container">
              <div
                className="background-image"
                style={{ backgroundImage: `url(${company.coverImage || defaultCoverImage})`}}
              >
                <div className="profile-picture-container">
                  <img style={{ borderRadius: '5px' }} src={company.logo} alt="Profile" className="profile-picture" />
                </div>
              </div><br />
              <div className="user-details">

                {console.log(company)}
                <div className='leftie'>
                  <h2>{company.name}</h2><br />
                  <p className='Location'>{company.industry}-{company.locations[0].address}-{company.size} Employees</p>

                  {displayButton && (
                    <button className="btn btn-primary">Send Message</button>
                  )}
                </div>
                <div className='right'>
                  {displayButton && (
                    <div className='right'>
                      <button className='editbtn' onClick={handleAddPost}><img src={edit} alt='edit' /></button>

                      <Modal show={showModal} onHide={() => setShowModal(false)} centered size='lg'>
                        <Modal.Header closeButton>
                          <Modal.Title>Edit Company Info</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <label className='bold-label'>Name:</label><br />
                          <input type='text' className='full-width' value={editedCompany.name} onChange={(e) => setEditedCompany({ ...editedCompany, name: e.target.value })} />
                          <br />
                          <label className='bold-label'>Industry:</label><br />
                          <input type='text' className='full-width' value={editedCompany.industry} onChange={(e) => setEditedCompany({ ...editedCompany, industry: e.target.value })} />
                          <br />
                          <label className='bold-label'>Location:</label><br />
                          <input type='text' className='full-width' value={editedCompany.location} onChange={(e) => setEditedCompany({ ...editedCompany, location: e.target.value })} />
                          <br />
                          {/* Add input fields for logo, coverImage, tagline, overview, websiteURL, companySize, founded, specialties */}
                          <label className='bold-label'>Logo:</label><br />
                          <input type='file' accept="image/*" onChange={handleLogoChange} />
                          <br />
                          <label className='bold-label'>Cover Image:</label><br />
                          <input type='file' accept="image/*" onChange={handleCoverImageChange} />
                          <br />
                          <label className='bold-label'>Tagline:</label><br />
                          <input type='text' className='full-width' value={editedCompany.tagline} onChange={(e) => setEditedCompany({ ...editedCompany, tagline: e.target.value })} />
                          <br />
                          <label className='bold-label'>Overview:</label><br />
                          <input type='text' className='full-width' value={editedCompany.overview} onChange={(e) => setEditedCompany({ ...editedCompany, overview: e.target.value })} />
                          <br />
                          <label className='bold-label'>Website URL:</label><br />
                          <input type='text' className='full-width' value={editedCompany.websiteURL} onChange={(e) => setEditedCompany({ ...editedCompany, websiteURL: e.target.value })} />
                          <br />
                          <label className='bold-label'>Company Size:</label><br />
                          <input type='text' className='full-width' value={editedCompany.companySize} onChange={(e) => setEditedCompany({ ...editedCompany, companySize: e.target.value })} />
                          <br />
                          <label className='bold-label'>Founded:</label><br />
                          <input type='text' className='full-width' value={editedCompany.founded} onChange={(e) => setEditedCompany({ ...editedCompany, founded: e.target.value })} />
                          <br />
                          <label className='bold-label'>Specialties:</label><br />
                          <input type='text' className='full-width' value={editedCompany.specialties} onChange={(e) => setEditedCompany({ ...editedCompany, specialties: e.target.value })} />
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                          </Button>
                          <Button variant="primary" onClick={handleEditCompanyInfo}>
                            Save Changes
                          </Button>
                        </Modal.Footer>
                      </Modal>

                    </div>
                  )}
                  <br />
                  <br />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyInfo