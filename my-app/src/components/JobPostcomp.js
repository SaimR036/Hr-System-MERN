import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import options from '../assets/more.png';
import { useNavigate } from 'react-router-dom';
import { ResumeItem } from './ResumeItem';
import Like from '../assets//like.png'
import DLike from '../assets/dislike.png'
import heart from '../assets/heart (1).png'

function JobPostcomp({ post, userId, displayButton }) {
    const navigate = useNavigate();
    const [showOptions, setShowOptions] = useState(false);
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [resumes, setResumes] = useState([]);
    const [loadingResumes, setLoadingResumes] = useState(false);
    const [error, setError] = useState(null);

    const [likes, setLikes] = useState(0);
    const [showCommentSection, setShowCommentSection] = useState(false);
    const [dislikes, setDisLikes] = useState();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    useEffect(() => {
        setLikes(post.likes.length);
        const fetchUser = async () => {
            try {
                const response = await axios.get(`/singlecomp/${userId}`);
                setUser(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Error fetching user data');
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId,post]);

    const fetchResumes = async () => {
        setLoadingResumes(true);
        try {
            const response = await axios.get(`/jobs/${post._id}/resumes`);
            setResumes(response.data);
        } catch (error) {
            console.error('Error fetching resumes:', error);
            setError('Error fetching resumes');
        } finally {
            setLoadingResumes(false);
        }
    };

    const handleLikeClick = async () => {
        try {
            // Send a request to update likes for the post
            const response = await axios.post(`/job/${post._id}/like`, { userId });
            // Assuming the backend responds with the updated post data
            const updatedPost = response.data;
            console.log("handle like: ", updatedPost)
            setLikes(updatedPost.likes.length);
            
            // Update the post state with the updated likes
            // setPost(updatedPost); // Assuming you have a state to hold the post data
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleDisLikeClick = async () => {
        try {
            // Send a request to update likes for the post
            const response = await axios.post(`/job/${post._id}/dislike`, { userId });
            // Assuming the backend responds with the updated post data
            const updatedPost = response.data;
            console.log("handle dislike: ", updatedPost)
            setLikes(updatedPost.likes.length);
            
            // Update the post state with the updated likes
            // setPost(updatedPost); // Assuming you have a state to hold the post data
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };
    const handleDeletePost = async (jobId) => {
        try {
            await axios.delete(`/jobs/${jobId}`);
          
        } catch (error) {
            console.error('Error deleting post:', error);
            setError('Error deleting post');
        }
    };

    const fetchUserName = async (uid) => {
        try {
            const response = await axios.get(`/singlecomp/${uid}`);
            return response.data.name;
        } catch (error) {
            console.error('Error fetching user name:', error);
            return null;
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }
    function navig(uid)
    {
      console.log('lop',uid)
      navigate(`/companyProfile/${uid}`, { state: { id:uid,display:false } })
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
                                        <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='par'>
                            <p style={{ marginLeft: '15px' }}>{post.Description}</p>
                            <img src={post.Image} alt='resume' className='resume-img' style={{ marginLeft: '8%' }} />
                            <hr style={{ width: '92%', marginLeft: '4%', marginTop: '5px' }} />
                        </div>
                        <div style={{ width: '45%' }}> <img className='hearticon' src={heart} alt="Likes" />
                                    <span> {likes}</span></div>
                        <div style={{ display: 'flex', width: '96%', margin: 'auto' }} >


                                <div style={{ width: '50%' }}>
                                    <button className='hover-button' onClick={handleLikeClick}>
                                        <span>
                                            <img className='icon' src={Like} alt="Likes"  /> Like
                                        </span>
                                    </button>
                                </div>
                                <div style={{ width: '50%' }}>
                                    <button className='hover-button' onClick={handleDisLikeClick} >
                                        <span>
                                            <img className='icon' src={DLike}  alt="Dislikes" /> Dislike
                                        </span>
                                    </button>
                                </div>
                              

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
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default JobPostcomp;
