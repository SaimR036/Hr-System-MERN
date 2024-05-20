import React, { useState, useEffect } from 'react';
import '../CSS/UserProfile.css';
import Info from './UserInfo';
import Activity from './Activity';
import Experience from './Experience';
import Education from './Education';
import ProfileURL from './ProfileURL';
import Skills from './Skills';
import Img from './Profimg';
import { useLocation, useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const location = useLocation();
  const { id, display} = location.state;
  const userid = id
  const [user, setUser] = useState(null); // Initialize as null to differentiate from an empty string
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('lolol',userid)
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/user/${userid}`);
        const res = await response.json();
        console.log("User data:", res);
        setUser(res);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userid]); // Fetch data based on the userid prop

  if (loading) {
    return <div>Loading...</div>; // Display a loading message while fetching data
  }

  if (!user) {
    return <div>No user data found.</div>; // Handle the case where no user data is found
  }

  return (
    <div className="container-custom col">
      <div className="row">
        <div className="col-md-9">
          <Info user={user} loading={loading} displayButton={display} style={{ backgroundColor: 'rgb(243, 243, 243)' }} />
          <Activity userid={user._id} displayButton={display} style={{ backgroundColor: 'white' }} />
          <Experience user={user} displayButton={display} style={{ backgroundColor: 'rgb(243, 243, 243)' }} />
          <Education user={user} displayButton={display} style={{ backgroundColor: 'rgb(243, 243, 243)' }} />
          <Skills user={user} displayButton={display} style={{ backgroundColor: 'rgb(243, 243, 243)' }} />
        </div>
        <div className="col-md-3">
          {user && (
            <ProfileURL firstname={user.firstName} lastname={user.lastName} />
          )}
          <Img />
        </div>
      </div>
    </div>
  );
}
