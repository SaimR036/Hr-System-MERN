import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Img from './Profimg'
import ProfileURL from './ProfileURL'
import { useParams } from 'react-router-dom';
import JobPostcomp  from './JobPostcomp';
function ComJobPosts({ userId }) {
  const location = useLocation();
  const { displayBtn } = location.state;
  console.log(displayBtn,"display button")
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userid } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user information
                console.log(userid);
                const userResponse = await axios.get(`http://localhost:3001/singlecomp/${userid}`);
                setUser(userResponse.data);
                // Fetch user posts
                const postsResponse = await axios.get(`http://localhost:3001/jobs/${userid}`);
                console.log(postsResponse);
                setPosts(postsResponse.data);
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [userid]);
    const handleDelete = (postId) => {
      setPosts(posts.filter(post => post._id !== postId));
  };

  return (
    <div class="container-custom col" >
      <div class="row">
      <div class="col-md-3">
        {user && (
            <ProfileURL firstname={user.firstName} lastname={user.lastName} displayButton={displayBtn} />
          )}
          <Img/>
          
        </div>
        <div class="col-md-6">
        <h4>All Activity</h4>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
            {posts
              .filter(post => post.author !== null)
              .map(post => (
                <li key={post._id}>
                  <JobPostcomp post={post} userId={user._id} onDelete={handleDelete} displayButton={displayBtn} />
                </li>
              ))}
          </ul>
          )}


        </div>
        <div class="col-md-3">
        {user && (
            <ProfileURL firstname={user.firstName} lastname={user.lastName} />
          )}
          <Img/>
          
        </div>
      </div>
    </div>
  )
}

export default ComJobPosts