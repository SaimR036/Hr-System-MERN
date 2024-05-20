
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import options from '../assets/more.png'
import heart from '../assets/heart (1).png'
import comments from '../assets/comment.png'
import Like from '../assets/like.png'

function CompanyPost({ post, userId,onDelete }) {
    const [showOptions, setShowOptions] = useState(false);
    const [likes, setLikes] = useState();
    const [showCommentSection, setShowCommentSection] = useState(false);


    const [newComment, setNewComment] = useState('');
    const [commentList, setCommentList] = useState(post.comments);



    useEffect(() => {
        setLikes(post.likes.length);
    }, [post]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Adjust the formatting as needed
    };

    const handleLikeClick = async () => {
        try {
            // Send a request to update likes for the post
            const response = await axios.post(`http://localhost:3001/Companylike/${post._id}`, { userId: userId });
            
            // Assuming the backend responds with the updated post data
            const updatedPost = response.data;
    
            // Check if updatedPost.likes is defined, otherwise treat it as 0 likes
            const likesCount = updatedPost.likes ? updatedPost.likes.length : 0;
            setLikes(likesCount);
    
            // Optionally update the post state with the updated likes if you have a state for post
            // setPost(updatedPost); // Uncomment if you manage post state
        } catch (error) {
            console.error('Error liking post:', error);
        }
    }
    const handleCommentsClick = () => {
        setShowCommentSection(!showCommentSection);
    };
    


    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = async () => {
        if (newComment.trim() === '') return;

        try {
            const currentDate = new Date();
            const response = await axios.post(`http://localhost:3001/Companycomment/${post._id}`, { userId, content: newComment ,createdDate: currentDate });
            const updatedPost = response.data;
            setCommentList(updatedPost.comments);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };



    const handleDeletePost = async () => {
        try {
            await axios.delete(`http://localhost:3001/Companydelpost/${post._id}`);
            onDelete(post._id); // Call the onDelete callback to remove the post from the list
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return (
        <div>




            <br />

            <div className="row">
                <div className="col-lg-12 offset-lg-0 col-md-8 offset-md-2">

                    <div className="user-info-container-v2" >

                        <div className="user-details">

                            <div className='leftie'>
                                <p className='author-intro-v2'>
                                    <b style={{ fontSize: 'large', color: 'black' }}>{post.author.name} </b>
                                    <br />
                                    {post.author.tagline}<br />

                                    {formatDate(post.createdAt)}</p>
                            </div>
                            <div className='right'>
                                <img style={{ width: '20px' }} src={options} alt="Options" onClick={() => setShowOptions(!showOptions)} />
                                {showOptions && (
                                    <div>
                                        <button onClick={handleDeletePost}>Delete</button>
                                    </div>
                                )}



                            </div>




                        </div>
                        <div className='par'>
                            <p style={{ marginLeft: '15px' }}>{post.content}</p>
                            <img src={post.image} alt='hdebnj' className='BgImg' />
                            <div style={{ display: 'flex', width: '96%', margin: 'auto' }}>
                                <div style={{ width: '45%' }}> <img className='hearticon' src={heart} alt="Likes" />
                                    <span> {likes}</span></div>
                                <div style={{ marginLeft: 'auto' }}>{post.comments.length} comments</div>

                            </div>
                            <hr style={{ width: '92%', marginLeft: '4%', marginTop: '5px' }} />

                            <div style={{ display: 'flex', width: '96%', margin: 'auto' }} >


                                <div style={{ width: '50%' }}>
                                    <button className='hover-button' onClick={handleLikeClick}>
                                        <span>
                                            <img className='icon' src={Like} alt="Likes" /> Like
                                        </span>
                                    </button>
                                </div>
                                <div style={{ width: '50%' }}>
                                    <button className='hover-button' onClick={handleCommentsClick}>
                                        <span>
                                            <img className='icon' src={comments} alt="Comments" /> Comment
                                        </span>
                                    </button>
                                </div>

                            </div>
                              
                            


                            




                        </div>
                        {showCommentSection && (
  <div style={{ width: '100%' }}>
    {/* Add comment section here */}
    <textarea
      rows="2"
      placeholder="Write a comment"
      style={{ width: '96%', borderRadius: '20px', marginLeft: '2%' }}
      value={newComment}
      onChange={handleCommentChange}
    ></textarea>
    <button
      style={{ width: '25%', borderRadius: '20px', marginLeft: '2%' }}
      onClick={handleCommentSubmit}
    >
      Post Comment
    </button>
    <br />
    <label>&nbsp; Comments</label>
    {/* Display all other comments */}
    {commentList.map(comment => (
      <div
        key={comment._id}
        className="user-info-container-v2"
        style={{ marginBottom: '5px', width: '96%', marginLeft: '2%' }}
      >
        <p style={{ marginLeft: '15px' }}>
          <b>
            {comment.author ? (
              comment.author.name
                ? comment.author.name
                : `${comment.author.firstName || ''} ${comment.author.lastName || ''}`
            ) : (
              'Unknown Author'
            )}
          </b>
          <br />
          <span style={{ color: 'gray', fontSize: 'smaller', marginTop: '-150px' }}>
            {formatDate(comment.createdAt)}
          </span>
          <br />
          {comment.content}
        </p>
      </div>
    ))}
  </div>
)}

  


                    </div>

                </div>

            </div>







        </div>
    );
}


export default CompanyPost