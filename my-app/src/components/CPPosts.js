import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/UserProfile.css';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import add from '../assets/add.png';
import media from '../assets/gallery.png';

function CPPosts({ userid, displayButton }) {
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
        const response = await axios.get(`http://localhost:3001/Cp/${userid}`);
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
    return date.toLocaleDateString(); // Adjust the formatting as needed
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

      const response = await axios.post('http://localhost:3001/createcompanypost', postData);

      if (response.status === 201) {
        setShowModal(false);
        setPosts([response.data, ...posts]); // Add the new post to the list of posts
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

  const convertToBase64 = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setMediaFile(reader.result);
    };
    reader.onerror = (error) => {
      console.error('Error:', error);
    };
  };

  const displayPosts = showAll ? posts : posts.slice(0, 2);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
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
                      <img src={add} alt="edit" />
                    </button>
                    <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                      <Modal.Header closeButton>
                        <Modal.Title>Create a New Post</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <textarea
                          placeholder="Enter post content"
                          className="postinput"
                          onChange={handleInputChange}
                        />
                        <label>
                          <input
                            type="file"
                            className="editbtn"
                            onChange={convertToBase64}
                            style={{ display: 'none' }}
                          />
                          <img className="editbtn" src={media} alt="media" />
                          <br />
                          <br />
                          {mediaFile && <img className="uploaded" src={mediaFile} alt="uploaded" />}
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
                {posts.length > 0 ? (
                  <ul className="list-unstyled">
                    {displayPosts.map((post, index) => (
                      <li key={post._id}>
                        <p className="author-intro">
                          <b>{post.author.name}</b> posted this on {formatDate(post.createdAt)}
                        </p>
                        <p>{post.content}</p>
                        {index !== displayPosts.length - 1 && <hr />}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No records found</p>
                )}
              </div>
              {posts.length > 0 && (
                <div className="text-center">
                  <button className="showall" onClick={() => navigate(`/allCompanyposts/${userid}`)}>
                    Show All Posts -&gt;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CPPosts;
