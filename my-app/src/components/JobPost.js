import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../CSS/UserProfile.css';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import add from '../assets/add.png';
import media from '../assets/gallery.png';

function JobPost({ company, displayButton }) {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [mediaFile, setMediaFile] = useState('');
    const [showModal, setShowModal] = useState(false);


    console.log("in job postttt:",company);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/jobs/${company._id}`);
                setPosts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching job posts:', error);
            }
        };

        fetchPosts();
    }, [company._id]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Adjust the formatting as needed
    };

    const handleAddPost = () => {
        setShowModal(true);
        // Add logic to handle creating a post
    };

    const handlePost = async () => {
        try {
            // Prepare the post data
            const currentDate = new Date();
            const postData = {
                Description: postContent,
                Image: mediaFile,
                Uid: company._id,
                company: company.name,
                likes: [],
                comments: [],
                Date: currentDate
            };

            // Send a POST request to the server
            const response = await axios.post('http://localhost:3001/jobs', postData);

            if (response.status === 201) {
                // Close the modal after successful post creation
                setShowModal(false);
            } else {
                console.error('Failed to create job:', response.data.message);
                // Handle error if needed
            }
        } catch (error) {
            console.error('Error job posting:', error);
            // Handle error if needed
        }
    };

    const handleInputChange = (event) => {
        setPostContent(event.target.value);
    };

    function convertToBase64(e) {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setMediaFile(reader.result);
        };
        reader.onerror = (error) => {
            console.log('error:', error);
        };
    }

    const displayPosts = showAll ? posts : posts.slice(0, 2);

    return (
        <div>
            <br />
            {!loading && posts && (
                <div className="row">
                    <div className="col-lg-12 offset-lg-0 col-md-8 offset-md-2">
                        <div className="user-info-container experience-container">
                            <div className="user-details">
                                <div className='leftie'><h4>JOB POSTING</h4></div>
                                {displayButton && (
                                    <div className='right'>
                                        <button className='editbtn' onClick={handleAddPost}><img src={add} alt='edit' /></button>
                                        <Modal show={showModal} onHide={() => setShowModal(false)} centered size='lg'>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Create a New Post</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <textarea placeholder="Enter post content" className='postinput' onChange={handleInputChange} />
                                                <label>
                                                    <input type="file" className='editbtn' onChange={convertToBase64} style={{ display: 'none' }} />
                                                    <img className='editbtn' src={media} alt='media' />
                                                    <br /><br />
                                                    {mediaFile === '' || mediaFile === null ? '' : <img className='uploaded' src={mediaFile} alt='uploaded' />}
                                                </label>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <button onClick={() => setShowModal(false)}>Close</button>
                                                <button onClick={handlePost}>Post</button>
                                            </Modal.Footer>
                                        </Modal>
                                    </div>
                                )}
                            </div>
                            <div className='postcontent'>
                                {loading ? (
                                    <p>Loading...</p>
                                ) : posts.length === 0 ? (
                                    <p>No job postings found.</p>
                                ) : (
                                    <ul className="list-unstyled">
                                        {displayPosts.map((post, index) => (
                                            <li key={post._id}>
                                                <p className='author-intro'><b>{post.name}</b> posted this on {formatDate(post.Date)}</p>
                                                <p>{post.Description}</p>
                                                {index !== displayPosts.length - 1 && <hr />}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {!showAll && !loading && posts.length > 0 && (
                                <div className="text-center">
                                    <button className="showall" onClick={() => navigate(`/Companyjobs/${company._id}`, { state: { displayBtn:displayButton } })}>Show All Posts -&gt;</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {loading && <p>Loading...</p>}
            {!loading && !posts && <p>No user data available</p>}
        </div>
    );
}

export default JobPost;
