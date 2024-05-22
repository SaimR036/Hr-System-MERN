import React from 'react'
import CompanyProfile from './CompanyProfile'
import { jwtDecode } from 'jwt-decode';
function MyCompany() {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;
  console.log("mycompanyprofile   jereeeee:",userId);

  return (
    <div><CompanyProfile userid={userId} display={true}/></div>
  )
}

export default MyCompany