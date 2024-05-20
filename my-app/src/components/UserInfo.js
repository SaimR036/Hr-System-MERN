import React from 'react';
import '../CSS/UserProfile.css'
import edit from '../assets/pencil.png'

function UserInfo({ user, loading,displayButton  }) {
  const countConnections = () => {
    if (user && user.connections) {
      return user.connections.length;
    }
    return 0;
  };

  return (
    <div>
      <br/>
      {!loading && user && (
        <div className="row">
        <div className="col-lg-12 offset-lg-0 col-md-8 offset-md-2">

            <div className="user-info-container experience-container">
              <div
                className="background-image"
                style={{ backgroundImage: `url(https://t3.ftcdn.net/jpg/00/86/56/12/360_F_86561234_8HJdzg2iBlPap18K38mbyetKfdw1oNrm.jpg)` }}
              >
                <div className="profile-picture-container">
                  <img src={user.profilePicture} alt="Profile" className="profile-picture" />
                </div>
              </div><br/>
              <div className="user-details">


                <div className='leftie'>
                <h2>{user.firstName} {user.lastName}</h2>
                <p className='Heading'>{user.headline}</p>
                <p className='Location'>{user.location}</p>
                <p className='Connections'>{countConnections()} Connections</p>
                {displayButton && (
                  <button className="btn btn-primary">Send Message</button>
                )}
                </div>
                <div className='right'>
                <button className='editbtn' ><img src={edit} alt='edit'/></button>
                <br/>
                <br/>
                <h6 className='Heading'>{user.education[0].institution}</h6>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      )}
      {loading && <p>Loading...</p>}
      {!loading && !user && <p>No user data available</p>}
    </div>
  );
}


export default UserInfo