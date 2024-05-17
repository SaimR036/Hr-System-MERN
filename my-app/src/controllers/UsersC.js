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
