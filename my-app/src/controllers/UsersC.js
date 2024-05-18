// UserService.js

export async function fetchPosts(id) {
    try {
        console.log('posts',id)
        const response = await fetch(`http://localhost:3001/getposts/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        return []; // Return an empty array in case of an error
    }
}
export async function setPrem(id) {
    try {
        console.log('users',id)

        const response = await fetch(`http://localhost:3001/setPrem/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        return []; // Return an empty array in case of an error
    }
}
export async function fetchUsers(id) {
    try {
        console.log('users',id)

        const response = await fetch(`http://localhost:3001/getuser/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        return []; // Return an empty array in case of an error
    }
}
export async function fetchAllUsers() {
    try {

        const response = await fetch(`http://localhost:3001/getallusers`);
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        return []; // Return an empty array in case of an error
    }
}
export async function updateWeights() {
    try {
      const response = await fetch('http://localhost:3001/updateFeatures', {
        method: 'PUT'
      });
      if (!response.ok) {
        throw new Error('Failed to update weights');
      }
      console.log('Documents updated successfully');
    } catch (error) {
      console.error('Error updating weights:', error);
    }
  }
  
export async function uploadPost(desc,image,Uid) {
    console.log(desc)
    // Send a POST request to the backend route '/upload'
    fetch('http://localhost:3001/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Specify the content type as JSON
        },
        body: JSON.stringify({Description:desc,Image:image,Uid:Uid  }) // Include all arguments in the request body
    })
    .then(response => {
        if (response.ok) {
            console.log('User uploaded successfully');
        } else {
            throw new Error('Failed to upload user');
        }
    })
    .catch(error => {
        console.error('Error uploading user:', error);
    });
  }
  
  export async function fetchSimilar(text) {
    try {
        console.log(text)

        const response = await fetch(`http://localhost:3001/fetchSimilar/${text}`);
        if (!response.ok) {
            throw new Error('Failed to fetch similars');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching similars:', error);
        return []; // Return an empty array in case of an error
    }
}


export async function sendreq(Sid,Rid)
{
    fetch('http://localhost:3001/sendReq', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Specify the content type as JSON
        },
        body: JSON.stringify({Sid:Sid,Rid:Rid }) // Include all arguments in the request body
    })
    .then(response => {
        if (response.ok) {
            console.log('Req uploaded successfully');
        } else {
            throw new Error('Failed to upload Req');
        }
    })
    .catch(error => {
        console.error('Error uploading Req:', error);
    });

}
export async function remFriend(Sid,Rid)
{
    fetch('http://localhost:3001/remFriend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Specify the content type as JSON
        },
        body: JSON.stringify({Sid:Sid,Rid:Rid }) // Include all arguments in the request body
    })
    .then(response => {
        if (response.ok) {
            console.log('Req uploaded successfully');
        } else {
            throw new Error('Failed to upload Req');
        }
    })
    .catch(error => {
        console.error('Error uploading Req:', error);
    });

}
export async function makeFriend(Sid,Rid)
{
    fetch('http://localhost:3001/makeFriend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Specify the content type as JSON
        },
        body: JSON.stringify({Sid:Sid,Rid:Rid }) // Include all arguments in the request body
    })
    .then(response => {
        if (response.ok) {
            console.log('Friend uploaded successfully');
        } else {
            throw new Error('Failed to upload Friend');
        }
    })
    .catch(error => {
        console.error('Error uploading Friend:', error);
    });

}
export async function remReq(Sid,Rid)
{
    fetch('http://localhost:3001/remReq', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Specify the content type as JSON
        },
        body: JSON.stringify({Sid:Sid,Rid:Rid }) // Include all arguments in the request body
    })
    .then(response => {
        if (response.ok) {
            console.log('Req uploaded successfully');
        } else {
            throw new Error('Failed to upload Req');
        }
    })
    .catch(error => {
        console.error('Error uploading Req:', error);
    });

}
export async function fetchFriends(id) {
    try {

        const response = await fetch(`http://localhost:3001/getfriends/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch friends');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching friends:', error);
        return []; // Return an empty array in case of an error
    }
}
export async function fetchWholeFriends(id) {
    try {

        const response = await fetch(`http://localhost:3001/getWholefriends/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch friends');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching friends:', error);
        return []; // Return an empty array in case of an error
    }
}

export async function getPending(id) {
    try {

        const response = await fetch(`http://localhost:3001/getPending/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch pendings');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching pendings:', error);
        return []; // Return an empty array in case of an error
    }
}
export async function fetchJobs(id) {
    try {

        const response = await fetch(`http://localhost:3001/getJobs/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch Jobs');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching Jobs:', error);
        return []; // Return an empty array in case of an error
    }
}
export async function banUser(id) {
    try {

        const response = await fetch(`http://localhost:3001/banUser/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch pendings');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching pendings:', error);
        return []; // Return an empty array in case of an error
    }
}
export async function UnbanUser(id) {
    try {

        const response = await fetch(`http://localhost:3001/UnbanUser/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch pendings');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching pendings:', error);
        return []; // Return an empty array in case of an error
    }
}
