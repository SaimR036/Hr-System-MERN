import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import '../CSS/UserProfile.css'
import axios from 'axios';
import { Modal} from 'react-bootstrap';
import add from '../assets/add.png'
import media from '../assets/gallery.png'

function Activity({ userid,displayButton }) {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [mediaFile, setMediaFile] = useState("");
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/activity/${userid}`);
                // const res = await response.json();
                setPosts(response.data);

                console.log("fetched posts:",posts)
                setLoading(false);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [userid]);
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
            console.log('Post Content:', postContent);
            console.log('Media File:', mediaFile);
            console.log('User ID:', userid);

            const postData = {
                content: postContent, // Assuming postContent is the state containing the post content
                file: mediaFile,// Assuming mediaFile is the state containing the selected media file
                author: userid, // Include the userid in the author field
                likes: [],
                comments: [],
                createdAt: currentDate
                // Add other fields as needed
            };

            console.log("after postData");
            // Send a POST request to the server
            const response = await axios.post('http://localhost:3001/createpost', postData);
            console.log(response.data.message);

            if (response.status === 201) {
                // Close the modal after successful post creation
                setShowModal(false);
            } else {
                console.error('Failed to create post:', response.data.message);
                // Handle error if needed
            }
        } catch (error) {
            console.error('Error posting:', error);
            // Handle error if needed
        }
    };
    const handleInputChange = (event) => {
        // Update the postContent state with the new value entered by the user
        setPostContent(event.target.value);
    };


    function converToBase64(e){
        console.log(e);
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload=()=>{
            console.log(reader.result);
            setMediaFile(reader.result);
        }
        reader.onerror=error =>{
            console.log("error:",error)
        }

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

                                <div className='leftie'><h4>Activity</h4>
                                </div>
                                {displayButton && (
                                <div className='right'>
                                    <button className='editbtn' onClick={handleAddPost}><img src={add} alt='edit' /></button>

                                    {/* Modal for adding a post */}
                                    <Modal show={showModal} onHide={() => setShowModal(false)} centered size='lg'>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Create a New Post</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            {/* Input fields for creating a post */}
                                            {/* Example: */}
                                            <textarea placeholder="Enter post content" className='postinput' onChange={handleInputChange} />
                                            <label >



                                            <input
                                                    type="file"
                                                    
                                                    className='editbtn'
                                                    onChange={converToBase64}
                                                    style={{ display: 'none' }}
                                                />
                                                <img className='editbtn' src={media} alt='media' />
                                             
                                                <br /><br />
                                                {mediaFile == "" || mediaFile ==null?"": <img className='uploaded'  src={mediaFile} alt='uploaded'/> }
                                            
                                            </label>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <button  onClick={() => setShowModal(false)}>
                                                Close
                                            </button>
                                            <button onClick={handlePost}>
                                                Post
                                            </button>
                                        </Modal.Footer>
                                    </Modal>


                                </div>)}
                            </div>




                            <div className='postcontent'>
                                {loading ? (
                                    <p>Loading...</p>
                                ) : (
                                    <ul className="list-unstyled">
                                        {displayPosts.map((post, index) => (
                                            <li key={post._id}>

                                                <p className='author-intro'><b>{post.author.firstName} {post.author.lastName}</b> posted this on  {formatDate(post.createdAt)}</p>
                                                <p>{post.content}</p>
                                                {/* Add additional post details as needed */}
                                                {index !== displayPosts.length - 1 && <hr />}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                            </div>

                            {!showAll && !loading && posts.length > 0 && (
                                <div className="text-center">
                                    <button className="showall" onClick={() => navigate(`/allposts/${userid}`)}>Show All Posts -&gt;</button>
                                </div>
                            )}
                        </div>
                    </div></div>
            )}
            {loading && <p>Loading...</p>}
            {!loading && !posts && <p>No user data available</p>}
        </div>
    );
}

export default Activity