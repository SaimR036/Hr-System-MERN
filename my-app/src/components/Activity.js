import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import '../CSS/UserProfile.css';
import add from '../assets/add.png';
import media from '../assets/gallery.png';
import { Description } from '@mui/icons-material';

function Activity({ userid, displayButton }) {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [mediaFile, setMediaFile] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/activity/${userid}`);
                setPosts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setLoading(false);
            }
        };

        fetchPosts();
    }, [userid]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const handleAddPost = () => {
        setShowModal(true);
    };

    const handlePost = async () => {
        try {
            const currentDate = new Date();
            const postData = {
                content: postContent,
                file: mediaFile,
                author: userid,
                likes: [],
                comments: [],
                createdAt: currentDate,
            };

            const response = await axios.post('http://localhost:3001/createpost', postData);

            
            

            const postDataM = {
                Description : postContent,
                file: mediaFile,
                author: userid,
                likes: [],
                comments: [],
                createdAt: currentDate,
            };
             
           await axios.post('http://localhost:3001/createpostM', postDataM);



            if (response.status === 201) {
                setShowModal(false);
                setPostContent('');
                setMediaFile('');
                // Refresh posts
                const updatedPosts = await axios.get(`http://localhost:3001/activity/${userid}`);
                setPosts(updatedPosts.data);
            } else {
                console.error('Failed to create post:', response.data.message);
            }





        } catch (error) {
            console.error('Error posting:', error);
        }
    };

    const handleInputChange = (event) => {
        setPostContent(event.target.value);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setMediaFile(reader.result);
        };
        reader.onerror = (error) => {
            console.error('Error reading file:', error);
        };
        reader.readAsDataURL(file);
    };

    const displayPosts = showAll ? posts : posts.slice(0, 2);

    return (
        <div>
            <br />
            {!loading && (
                <div className="row">
                    <div className="col-lg-12 offset-lg-0 col-md-8 offset-md-2">
                        <div className="user-info-container experience-container">
                            <div className="user-details">
                                <div className="leftie">
                                    <h4>Activity</h4>
                                </div>
                                {displayButton && (
                                    <div className="right">
                                        <button className="editbtn" onClick={handleAddPost}>
                                            <img src={add} alt="Add" />
                                        </button>

                                        <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                                            <Modal.Header closeButton>
                                                <Modal.Title>Create a New Post</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <textarea
                                                    placeholder="Enter post content"
                                                    className="postinput"
                                                    value={postContent}
                                                    onChange={handleInputChange}
                                                />
                                                <label>
                                                    <input
                                                        type="file"
                                                        className="file-input"
                                                        onChange={handleFileChange}
                                                        style={{ display: 'none' }}
                                                    />
                                                    <img className="editbtn" src={media} alt="Media" />
                                                    {mediaFile && <img className="uploaded" src={mediaFile} alt="Uploaded" />}
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

                            <div className="postcontent">
                                {loading ? (
                                    <p>Loading...</p>
                                ) : posts.length > 0 ? (
                                    <ul className="list-unstyled">
                                        {displayPosts.map((post, index) => (
                                            <li key={post._id}>
                                                <p className="author-intro">
                                                    <b>{post.author.firstName} {post.author.lastName}</b> posted this on {formatDate(post.createdAt)}
                                                </p>
                                                <p>{post.content}</p>
                                                {index !== displayPosts.length - 1 && <hr />}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No activity present</p>
                                )}
                            </div>

                            {!showAll && !loading && posts.length > 0 && (
                                <div className="text-center">
                                    <button className="showall" onClick={() => navigate(`/allposts/${userid}`)}>Show All Posts -&gt;</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {loading && <p>Loading...</p>}
        </div>
    );
}

export default Activity;
