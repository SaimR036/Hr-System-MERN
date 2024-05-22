import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import CompanyProfile from './CompanyProfile'
function OthersCompany() {

  const { userID } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Get current user ID from token
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const currentID = decodedToken.userId;


  useEffect(() => {
    // Check if the current user ID matches the profile user ID
    if (currentID === userID) {
      // Navigate to another route if the IDs match
      navigate('/mycompanyprofile');
    } else {
      // Set loading to false if no navigation occurs
      setLoading(false);
    }
  }, [currentID, userID, navigate]);


  return (
    <div>{!loading && <CompanyProfile userid={userID} displayButton={false}/>}</div>
  )
}

export default OthersCompany