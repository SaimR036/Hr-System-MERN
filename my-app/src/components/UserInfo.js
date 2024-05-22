import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../CSS/UserProfile.css';
import axios from 'axios';
import edit from '../assets/pencil.png';

function UserInfo({ user, loading, displayButton }) {
  const countConnections = () => {
    if (user?.connections) {
      return user.connections.length;
    }
    return 0;
  };

  // State to manage the modal visibility
  const [showModal, setShowModal] = useState(false);

  // State to manage user data for editing
  const [editedUser, setEditedUser] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    Headline: user?.Headline || '',
    location: user?.location || '',
    Photo: user?.logo || ''
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
      setEditedUser((prevState) => ({
        ...prevState,
        Photo: base64Image,
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  // Function to handle saving edited user info
  const handleEditUserInfo = async () => {
    try {
      // Send PUT request to update user data
      await axios.put(`/user/${user._id}`, editedUser);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating user:', error);
      // Handle error if needed
    }
  };

  return (
    <div>
      <br />
      {!loading && user && (
        <div className="row">
          <div className="col-lg-12 offset-lg-0 col-md-8 offset-md-2">
            <div className="user-info-container experience-container">
              <div
                className="background-image"
                style={{ backgroundImage: `url(https://t3.ftcdn.net/jpg/00/86/56/12/360_F_86561234_8HJdzg2iBlPap18K38mbyetKfdw1oNrm.jpg)` }}
              >
                <div className="profile-picture-container">
                  <img src={user?.Photo || ''} alt="Profile" className="profile-picture" />
                </div>
              </div>
              <br />
              <div className="user-details">
                <div className='leftie'>
                  <h2>{user?.firstName || ''} {user?.lastName || ''}</h2>
                  <p className='Heading'>{user?.Headline || ''}</p>
                  <p className='Location'>{user?.location || ''}</p>
                  <p className='Connections'>{countConnections()} Connections</p>
                  {!displayButton && (
                    <button className="btn btn-primary">Send Message</button>
                  )}
                  &nbsp;
                  {!displayButton && (
                    <button className="btn btn-primary">Follow</button>
                  )}
                </div>
                <div className='right'>
                  {displayButton && (
                    <div className='right'>
                      <button className='editbtn' onClick={handleAddPost}><img src={edit} alt='edit' /></button>

                      <Modal show={showModal} onHide={() => setShowModal(false)} centered size='lg'>
                        <Modal.Header closeButton>
                          <Modal.Title>Edit User Info</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <label className='bold-label'>First Name:</label><br />
                          <input type='text' className='full-width' value={editedUser.firstName} onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })} />
                          <br />
                          <label className='bold-label'>Last Name:</label><br />
                          <input type='text' className='full-width' value={editedUser.lastName} onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })} />
                          <br />
                          <label className='bold-label'>Headline:</label><br />
                          <input type='text' className='full-width' value={editedUser.Headline} onChange={(e) => setEditedUser({ ...editedUser, Headline: e.target.value })} />
                          <br />
                          <label className='bold-label'>Location:</label><br />
                          <input type='text' className='full-width' value={editedUser.location} onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })} />

                          <br />
                          <label className='bold-label'>Profile Picture:</label><br />
                          <input type='file' accept='image/*' onChange={handleLogoChange} />
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                          </Button>
                          <Button variant="primary" onClick={handleEditUserInfo}>
                            Save Changes
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  )}
                  <br />
                  <br />
                  <h6 className='Heading'>{user?.education?.[0]?.institution || ''}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {loading && <p>Loading...</p>}
      {!loading && !user && <p>No user data available</p>}
    </div>
  );
}

export default UserInfo;
