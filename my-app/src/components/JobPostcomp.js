import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import options from '../assets/more.png';
import { useNavigate } from 'react-router-dom';
import  { ResumeItem }  from './ResumeItem'
function JobPostcomp({ post, userId, displayButton }) {
    const navigate = useNavigate();
    const [showOptions, setShowOptions] = useState(false);
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [resumes, setResumes] = useState([]);
    const [loadingResumes, setLoadingResumes] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`/singlecomp/${userId}`);
                setUser(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, [userId]);

    const fetchResumes = async () => {
        setLoadingResumes(true);
        try {
            const response = await axios.get(`/jobs/${post._id}/resumes`);
            setResumes(response.data);
        } catch (error) {
            console.error('Error fetching resumes:', error);
        } finally {
            setLoadingResumes(false);
        }
    };

    function navig(uid) {
        navigate(`/companyProfile/${uid}`, { state: { id: uid, display: false } });
    }

    const handleDeletePost = async () => {
        try {
            // Delete post logic
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const fetchUserName = async (uid) => {
        try {
            const response = await axios.get(`/singlecomp/${uid}`);
            return response.data.name; // Return the user name
        } catch (error) {
            console.error('Error fetching user name:', error);
            return null;
        }
    };


    if (loading) {
        return <p>Loading...</p>;
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
                                    <b style={{ fontSize: 'large', color: 'black' }} onClick={() => { navig(user._id) }}>{user.name}</b><br />
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
                            <img src={post.Image} alt='resume' className='resume-img' style={{marginLeft : '8%'}} />
                            <hr style={{ width: '92%', marginLeft: '4%', marginTop: '5px' }} />
                        </div>

                        {displayButton && (
    <>
        <Button onClick={() => {
            setShowModal(true);
            fetchResumes();
        }}>Show Resumes</Button>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Resumes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loadingResumes ? (
                    <p>Loading resumes...</p>
                ) : resumes.length ? (
                    <ul>
                        {resumes.map((resume) => (
                            <ResumeItem key={resume._id} resume={resume} />
                        ))}
                    </ul>
                ) : (
                    <p>No resumes found for this job.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    </>
)}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobPostcomp;
