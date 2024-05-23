
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import options from '../assets/more.png'
import heart from '../assets/heart (1).png'
import comments from '../assets/comment.png'
import Like from '../assets//like.png'
import DLike from '../assets/dislike.png'
import { jwtDecode } from 'jwt-decode';

function Post({ post, userId,onDelete }) {
    const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const id = decodedToken.userId;
    const navigate = useNavigate();
    const [showOptions, setShowOptions] = useState(false);
    const [likes, setLikes] = useState();
    const [showCommentSection, setShowCommentSection] = useState(false);
    const [dislikes, setDisLikes] = useState();

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
            const response = await axios.post(`http://localhost:3001/like/${post._id}`, { userId: userId });
            // Assuming the backend responds with the updated post data
            const updatedPost = response.data;
            setLikes(updatedPost.likes.length);
            
            // Update the post state with the updated likes
            // setPost(updatedPost); // Assuming you have a state to hold the post data
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };
     
    const handleCommentsClick = () => {
        setShowCommentSection(!showCommentSection);
    };

    const handleDisLikeClick = async () => {
        try {
            // Send a request to update likes for the post
            const response = await axios.post(`http://localhost:3001/dislike/${post._id}`, { userId: userId });
            // Assuming the backend responds with the updated post data
            const updatedPost = response.data;
            setDisLikes(updatedPost.dislikes.length);
            // Update the post state with the updated likes
            // setPost(updatedPost); // Assuming you have a state to hold the post data
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };
    


    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = async () => {
        if (newComment.trim() === '') return;

        try {
            const currentDate = new Date();
            const response = await axios.post(`http://localhost:3001/comment/${post._id}`, { userId, content: newComment, createdDate: currentDate });
            const updatedPost = response.data;
            setCommentList(updatedPost.comments);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    function navig(uid)
  {
    console.log('lop',uid)
    navigate(`/other/${uid}`, { state: { id:uid,display:false } })
  }
    


    const handleDeletePost = async () => {
        try {
            await axios.delete(`http://localhost:3001/delpost/${post._id}`);
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
                                    <b style={{ fontSize: 'large', color: 'black' }} onClick={()=>{navig(post.author._id)}}>{post.author.firstName} {post.author.lastName} </b>
                                    <br />
                                    {post.author.Headline}<br />

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


                                <div style={{ width: '33%' }}>
                                    <button className='hover-button' onClick={handleLikeClick}>
                                        <span>
                                            <img className='icon' src={Like} alt="Likes" /> Like
                                        </span>
                                    </button>
                                </div>
                                <div style={{ width: '33%' }}>
                                    <button className='hover-button' onClick={handleDisLikeClick}>
                                        <span>
                                            <img className='icon' src={DLike}  alt="Dislikes" /> Dislike
                                        </span>
                                    </button>
                                </div>
                                <div style={{ width: '33%' }}>
                                    <button className='hover-button' onClick={handleCommentsClick}>
                                        <span>
                                            <img className='icon' src={comments} alt="Comments" /> Comment
                                        </span>
                                    </button>
                                </div>

                            </div>
                              
                            


                            




                        </div>
                        {showCommentSection && (
                                <div style={{width:'100%'}} >
                                    {/* Add comment section here */}
                                    <textarea rows="2" placeholder="Write a comment" style={{width:'96%', borderRadius:'20px',marginLeft:'2%'}} value={newComment}
                                    onChange={handleCommentChange}></textarea>
                                    <button style={{width:'25%', borderRadius:'20px',marginLeft:'2%'}} onClick={handleCommentSubmit}> Post Comment</button><br/>
                                    <label> &nbsp; Comments</label>
                                    {/* Display all other comments */}
                                    {commentList.map(comment => (
                                    <div key={comment._id} className='user-info-container-v2' style={{ marginBottom: '5px', width: '96%', marginLeft: '2%' }}>
                                        <p style={{ marginLeft: '15px' }}>
                                            <b>{comment.author.firstName}</b>
                                            <br />
                                            <span style={{ color: 'gray', fontSize: 'smaller', marginTop: '-150px' }}>{formatDate(comment.createdAt)}</span>
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

export default Post