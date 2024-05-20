import React from 'react'
import UserProfile from './UserProfile'
function MyProfile() {
  //pass userid in below userid , make sure ke its saved in db first
  return (
    
    <div><UserProfile userid={'66491b790254e7b9338712fd'} display={true}/></div>
  )
}

export default MyProfile