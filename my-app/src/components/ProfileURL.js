import React from 'react'
import '../CSS/UserProfile.css'
function ProfileURL({firstname,lastname}) {
  return (
    <div>
    <br />
    
      <div className="row">
        <div className="col-lg-12 offset-lg-0 col-md-8 offset-md-2">
          <div className="user-info-container experience-container"><br/>
            <h4>Profile Language </h4>
            <p className='prof'>English</p>
            <hr/>
            <h4>Profile URL </h4>
            <p className='prof'>Profile URL: www.linkedin.com/in/{firstname}-{lastname}</p>
          </div>
        </div>
      </div>
    
  </div>
  );
}

export default ProfileURL