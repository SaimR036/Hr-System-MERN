import React, { useState, useEffect } from 'react';
import axios from 'axios';
import options from '../assets/more.png'

function JobPostcomp({ post, userId, onDelete }) {
    const [showOptions, setShowOptions] = useState(false);
    const [user, setUser] = useState(null); // Initialize user state as null
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('');

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Adjust the formatting as needed
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/singlecomp/${userId}`);
                setUser(response.data);
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
            const base64Promises = selectedFiles.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });
            });

            const base64Strings = await Promise.all(base64Promises);

            // Send base64 encoded resumes to the server
            const response = await axios.post(`/upload-resumes/${post._id}`, { resumes: base64Strings });
            setUploadStatus(response.data.message);
        } catch (error) {
            console.error('Error uploading resumes:', error);
            setUploadStatus('Failed to upload resumes');
        }
    };
    const handleDeletePost = async () => {
        try {
            await axios.delete(`/jobs/${post._id}`);
            onDelete(post._id); // Call the onDelete callback to remove the post from the list
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    // Render nothing if user data is not fetched yet
    if (!user) {
        return null;
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobPostcomp;
