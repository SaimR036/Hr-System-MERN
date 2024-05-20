import React from 'react'
import UserProfile from './UserProfile'
import { jwtDecode } from 'jwt-decode';

function MyProfile() {
  const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
            console.log(userId);
 
  return (
    
    <div><UserProfile userid={userId} display={true}/></div>
  )
}

export default MyProfile