import 'bootstrap/dist/css/bootstrap.min.css';
import Feed from './feed';
import { fetchUsers,fetchPosts,fetchFriends, updateWeights } from '../controllers/UsersC.js';
import { useEffect, useState } from 'react';
import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
 import Dash from './Dash'
 import premi from '../assets/premium.jpeg'
 import Search from './searched'
import Navi from './nav'
import {Link,useNavigate,Router} from 'react-router-dom'
import { jwtDecode } from 'jwt-decode';
export function Home() {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const id = decodedToken.userId;  
  console.log(id)
  const [users, setUsers] = useState(null);
  const [posts,setPosts]  = useState(null);
  const [dum,setDum] = useState(1);
  const [combinedData, setCombinedData] = useState([]);
  const [loaded,setLoaded] = useState(false)
  const navig = useNavigate()
  const [us,setUs] = useState(null)

  useEffect(() => {
    async function qw()
    {
      const pe = await fetchUsers(id)
          setUs(pe)
    }
    qw()
    async function fetchData() {
      try {
        
          
        const friends = await fetchFriends(id);
        console.log('friends',friends)
        friends.map(async (idf)=>{
        console.log('idahhhhh', idf);
        const userPosts = await fetchPosts(idf);
        const usersData = await fetchUsers(idf);
          console.log('user',usersData)
        // Combine user and post data into an array of objects
        if (userPosts.length > 0) {
          // Combine user and post data into an array of objects
          const combined = userPosts.map((post, index) => ({
            post,
            user: usersData // Assuming userPosts and usersData have the same length
          }));
          // Append the new combined data to the existing array
          setCombinedData(prevData => [...prevData, ...combined]);
          

          console.log('Combined Data1', combined);
        
        }

        })
      
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData()
    

  },[])
 
  
   

  if (combinedData.length==0||us==null) {
      return <div>No data available</div>; // handle case when users or posts are empty
  }

  function navigate()
  {
    navig('/checkout')
  }
  return (
    <>
    <Navi />
    {
    console.log(us)}{
    us!==null && us.prem==0?
    <button onClick={navigate} className='d-flex align-items-center justify-content-center offset-9 col-2' style={{position:'absolute',backgroundColor:'blue', marginTop:'5%'}}  ><img className='col-12' style={{position:'absolute'}} src={premi}></img></button> 
    :<></>}
    
    <div className='row '>
    {
    combinedData.sort((a, b) => new Date(b.post.Date) - new Date(a.post.Date)).map((data, index) => {
      return (
        <Feed 
          key={index}
          Date={data['post'].Date} 
          Name={data['user'].Name} 
          Prof={data['user'].Photo} 
          Desc={data['post'].Description} 
          Image={data['post'].Image} 
        />
      );
    })
  }</div>
  
   
  
    
    
    </>
    

  );
}

export default Home;
export{};
