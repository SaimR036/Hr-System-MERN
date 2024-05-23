import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Img from './Profimg'
import ProfileURL from './ProfileURL'
import { useParams } from 'react-router-dom';
import Post from './Post';

function AllPosts({ userId }) {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userid } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user information
                console.log(userid);
                const userResponse = await axios.get(`http://localhost:3001/singleuser/${userid}`);
                setUser(userResponse.data);
                
                // Fetch user posts
                const postsResponse = await axios.get(`http://localhost:3001/activity/${userid}`);
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
            <ProfileURL firstname={user.firstName} lastname={user.lastName} />
          )}
          <Img/>
          
        </div>
        <div class="col-md-6">
        <h4>All Activity</h4>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {posts.map(post => (
                <li key={post._id}>
                      <Post post={post} userId = {user._id} onDelete={(handleDelete)} />
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

export default AllPosts