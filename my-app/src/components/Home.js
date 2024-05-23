import 'bootstrap/dist/css/bootstrap.min.css';
import Feed from './feed';
import { fetchUsers,fetchPosts,fetchFriends, updateWeights } from '../controllers/UsersC.js';
import { useEffect, useState } from 'react';
import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
 import Dash from './Dash'
 import premi from '../assets/premium.jpeg'
 import axios from 'axios';
 import Search from './searched'
 import Post from './Post'
import Navi from './nav'
import {Link,useNavigate,Router} from 'react-router-dom'
import { jwtDecode } from 'jwt-decode';
export function Home() {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const id = decodedToken.userId;  
  const [isLoading, setIsLoading] = useState(true);  // Loading state

  console.log(id)
  const [users, setUsers] = useState(null);
  const [posts,setPosts]  = useState(null);
  const [dum,setDum] = useState(1);
  const [combinedData, setCombinedData] = useState([]);
  const [loaded,setLoaded] = useState(false)
  const navig = useNavigate()
  const [us,setUs] = useState(null)

  const [posts1, setPosts1] = useState([]);

                // Fetch user posts
                
  useEffect(() => {
    async function qw()
    {
      const pe = await fetchUsers(id)
          setUs(pe)
          // const postsResponse = await axios.get(`http://localhost:3001/friendacts/${id}`);
          // console.log('IDD',id)
          // if (postsResponse.data) {
          //   setPosts1(postsResponse.data);
          //   console.log("Posts", posts1);
          // } 
              
    }
    qw()
    async function fetchData() {
      try {
       
        const friends = await fetchFriends(id);
        console.log('friends', friends);
    
        // Use Promise.all to wait for all requests to complete
        const postsPromises = friends.map(idf => axios.get(`http://localhost:3001/activity/${idf}`));
        const postsResponses = await Promise.all(postsPromises);
    
        // Flatten the array of responses and sort them
        const allPosts = postsResponses.flatMap(response => response.data);
        allPosts.sort((a, b) => new Date(b.Date) - new Date(a.Date));
    
        // Update the state
        setPosts1(allPosts);
        console.log('Posts1', posts1);
    
        setIsLoading(false);
          
        // console.log('idahhhhh', idf);
        // const userPosts = await fetchPosts(idf);
        // const usersData = await fetchUsers(idf);
        //   console.log('user',usersData)
        // // Combine user and post data into an array of objects
        // if (userPosts.length > 0) {
        //   // Combine user and post data into an array of objects
        //   const combined = userPosts.map((post, index) => ({
        //     post,
        //     user: usersData // Assuming userPosts and usersData have the same length
        //   }));
        //   // Append the new combined data to the existing array
        //   setCombinedData(prevData => [...prevData, ...combined]);
          

        //   console.log('Combined Data1', combined);
        
        // }
          
        }
        
       catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData()
    

  },[])
 
  
  const handleDelete = (postId) => {
    setPosts(posts1.filter(post => post._id !== postId));
};



  function navigate()
  {
    navig('/checkout')
  }
  if (isLoading) {
    return <div>Loading...</div>;  // Display loading message while fetching data
  }
  return (
    <>
    <Navi />
    
    {
    console.log(us)}{
    us!==null && us.prem==0?
    <button onClick={navigate} className='d-flex align-items-center justify-content-center offset-10 col-2 ' style={{position:'absolute',backgroundColor:'blue', marginTop:'5%'}}  ><img className='col-12' style={{position:'absolute'}} src={premi}></img></button> 
    :<>Premi</>}
    
    <div className='row '>
    {isLoading ? (
            <p>Loading...</p>
          ) : (
            <ul className='col-md-7 container-fluid col-sm-8 col-8'>
              {posts1 && posts1.map(post => (
                <li >
                      <Post post={post} userId = {id} onDelete={handleDelete} />
                </li>
              ))}
            </ul>
)}
    {/* // combinedData.length === 0 ? (
    //   <p>No Friend Posts</p>
    // ) :  combinedData.sort((a, b) => new Date(b.post.Date) - new Date(a.post.Date)).map((data, index) => {
    //   return (
    //     <Feed 
    //       key={index}
    //       Date={data['post'].Date} 
    //       Name={data['user'].Name} 
    //       Prof={data['user'].Photo} 
    //       Desc={data['post'].Description} 
    //       Image={data['post'].Image} 
    //     />
    //   );
    // }) */}
  </div>
  
   
  
    
    
    </>
    

  );
}

export default Home;
export{};