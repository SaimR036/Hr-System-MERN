import 'bootstrap/dist/css/bootstrap.min.css';
import Feed from './feed';
import { fetchUsers,fetchPosts,fetchFriends, updateWeights } from './controllers/UsersC';
import { useEffect, useState } from 'react';
import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
 import Dash from './Dash'
 import Search from './searched'
import Navi from './nav'
export function Home() {
  let id ='66431ebfefaafd854aa6aa0c';
  const [users, setUsers] = useState(null);
  const [posts,setPosts]  = useState(null);
  const [dum,setDum] = useState(1);
  const [combinedData, setCombinedData] = useState([]);
  const [loaded,setLoaded] = useState(false)
  useEffect(() => {
    async function fetchData() {
      try {
       

        updateWeights()
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
    
    }, [dum]);
  
   

  if (combinedData.length==0) {
      return <div>No data available</div>; // handle case when users or posts are empty
  }
  return (
    <>
    <Navi />
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
  }
    
    
    </>
    

  );
}

export default Home;
export{};
