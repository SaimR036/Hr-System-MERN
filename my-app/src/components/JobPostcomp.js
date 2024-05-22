import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap'; // Import Modal and Button components
import options from '../assets/more.png';

function JobPostcomp({ post, userId, onDelete , displayButton}) {
    const [showOptions, setShowOptions] = useState(false);
    const [user, setUser] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('');
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const [loading, setLoading] = useState(true); // State to manage loading status

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`/singlecomp/${userId}`);
                setUser(response.data);
                setLoading(false); // Update loading state when user data is fetched
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
    
        fetchUser();
    }, [userId]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    };

    const uploadFiles = async () => {
        try {
            // Upload files logic
        } catch (error) {
            console.error('Error uploading resumes:', error);
            setUploadStatus('Failed to upload resumes');
        }
    };

    const handleDeletePost = async () => {
        try {
            // Delete post logic
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>; // Render loading indicator while fetching data
    }
    return (
        <div>
            <br />
            <div className="row">
                <div className="col-lg-12 offset-lg-0 col-md-8 offset-md-2">
                    <div className="user-info-container-v2">
                        <div className="user-details">
                            <div className='leftie'>
                                <p className='author-intro-v2'>
                                    <b style={{ fontSize: 'large', color: 'black' }}>{user.name} </b>
                                    <br />
                                    {user.tagline}<br />
                                    {formatDate(post.Date)}
                                </p>
                            </div>
                            <div className='right'>
                                <img style={{ width: '20px' }} src={options} alt="Options" onClick={() => setShowOptions(!showOptions)} />
                                {showOptions && (
                                    <div>
                                        <button onClick={handleDeletePost}>Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='par'>
                            <p style={{ marginLeft: '15px' }}>{post.Description}</p>
                            <img src={post.Image} alt='hdebnj' className='BgImg' />
                            <hr style={{ width: '92%', marginLeft: '4%', marginTop: '5px' }} />
                            <input type="file" multiple onChange={handleFileChange} />
                            <button onClick={uploadFiles}>Upload Resumes</button>
                            {uploadStatus && <p>{uploadStatus}</p>}
                        </div>

                        {displayButton && (<><Button onClick={() => setShowModal(true)}>Show Resumes</Button><Modal show={showModal} onHide={() => setShowModal(false)}> {/* Modal for showing posts */}
                            {/* Modal Content */}
                        </Modal></>)}
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default JobPostcomp;
