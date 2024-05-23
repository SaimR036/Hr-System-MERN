import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { fetchJobs } from '../controllers/UsersC';
import Navi from './nav'
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Like from '../assets//like.png'
import DLike from '../assets/dislike.png'
import heart from '../assets/heart (1).png'

export function Jobs()
{
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
    const [job,SetJobs]= useState([])
    const [image,setImage] = useState(null)



    const [likes, setLikes] = useState(0);
    const [showCommentSection, setShowCommentSection] = useState(false);



    useEffect(()=>{
        
        async function fetchAndSetJobs() {
            var jobs = await fetchJobs(userId);
            SetJobs(jobs);
            console.log(jobs);
        }
        fetchAndSetJobs();
    },[])
    function check(e) {
        const file = e.target.files[0];
        const fileType = file.type.toLowerCase();
        if (!fileType.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            console.log('File loaded:', reader.result);
            setImage(reader.result);
        };
        reader.onerror = (error) => {
            console.log('Error: ', error);
        };
    }

    function subresume(id,pid)
    {
    fetch('http://localhost:3001/subResume', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Specify the content type as JSON
        },
        body: JSON.stringify({Uid:id,Pid:pid,Userid:userId,image:image  }) // Include all arguments in the request body
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

const handleLikeClick = async (jid) => {
    try {
        // Send a request to update likes for the post
        const response = await axios.post(`/job/${jid}/like`, { userId });
        // Assuming the backend responds with the updated post data
        const updatedPost = response.data;
        console.log("handle like: ", updatedPost)
        setLikes(updatedPost.likes.length);
        
        // Update the post state with the updated likes
        // setPost(updatedPost); // Assuming you have a state to hold the post data
    } catch (error) {
        console.error('Error liking post:', error);
    }
};

const handleDisLikeClick = async (jid) => {
    try {
        // Send a request to update likes for the post
        const response = await axios.post(`/job/${jid}/dislike`, { userId });
        // Assuming the backend responds with the updated post data
        const updatedPost = response.data;
        console.log("handle dislike: ", updatedPost)
        setLikes(updatedPost.likes.length);
        
        // Update the post state with the updated likes
        // setPost(updatedPost); // Assuming you have a state to hold the post data
    } catch (error) {
        console.error('Error liking post:', error);
    }
};

    function profile(uid){

    navigate(`/companyProfile/${uid}`, { state: { id:uid,display:false } })
  }
    return(<>
        <Navi />
        
        <div className='col-md-5 col-sm-10 col-10 container-fluid mt-4 container rounded bg-light' style={{ minHeight: '25vh' }}>
            {job.map((item, index) => (
                

                <div class="row mt-3">
                <div className="col-12 col-sm-12 col-md-12 container-fluid bg-light ml-auto rounded  container border" >
            
            <div class="row ">            
            <div className='col-md-12 truncate offset-md-0 col-12 col-sm-12 mt-2 '>
            <div className='row d-flex'>
            <div className='truncate col-md-6 offset-md-0 col-sm-6 col-6' >
            <a className="company-link" onClick={() => { profile(item['Uid']) }}>{item['company']}</a>
                
                
                
                 </div>
   
                 <input onChange={check} className="truncate col-md-3 offset-md-0 col-sm-3 col-3 mt-1" type="file" id="fileInput" accept="image/*"></input>
                <button  onClick={()=>{subresume(item['Uid'],item['_id'])}}   className='btn btn-primary truncate col-md-2 offset-md-0 col-sm-2 col-2'>Submit</button>

            </div>
            <div className='truncate col-md-12 offset-md-0 col-sm-12 '>{item['Date']}</div>
            </div>
        
            </div>
            <div style={{border:'0.5px inset #d3d3d3',marginTop:'8%',marginBottom:'2%'}}></div>
            <div className='mb-2'>{item['Description']}</div>
            {<img src={item['Image']} style={{border:'1px solid black'}}  className='col-12 rounded mb-2' alt="Rounded" />}

            <div style={{ width: '45%' }}> <img className='hearticon' src={heart} alt="Likes" />
                                    <span> {item['likes'].length}</span></div>
            <div style={{ display: 'flex', width: '96%', margin: 'auto' }} >


                                <div style={{ width: '50%' }}>
                                    <button className='hover-button' onClick={() => { handleLikeClick(item._id)}}>
                                        <span>
                                            <img className='icon' src={Like} alt="Likes"  /> Like
                                        </span>
                                    </button>
                                </div>
                                <div style={{ width: '50%' }}>
                                    <button className='hover-button' onClick={() => { handleDisLikeClick(item._id)}} >
                                        <span>
                                            <img className='icon' src={DLike}  alt="Dislikes" /> Dislike
                                        </span>
                                    </button>
                                </div>
                              

                            </div>















            </div>
            </div>
            
        ))}
        </div>
        <style>
                {`
                .company-link {
                    cursor: pointer;
                    font-size: 1.25rem;  // Increase font size as needed
                    font-weight: bold;   // Make text bold
                    color: blue;         // Optional: Add any additional styling you like
                }
                `}
            </style>
    
    
    </>)
// <div class='row' key={index} style={{ color:'gray',border:'2px solid  black',borderRadius:'20px',marginBottom:'20px'}}>
            // <img src={item.Image} style={{border:'1px solid black',marginLeft:'2px',marginBottom:'10px'}} className="w-15 h-20 mt-2 rounded-circle col-md-2 col-sm-2 col-2 col-lg-2 align-items-center" alt="Rounded" />
            
            // <div className='col-md-6 truncate offset-md-0 col-6 col-sm-6 mt-2'>
            // <div className='truncate col-md-10 offset-md-0 col-sm-6 '>{item.Description} </div>
            // <div className='truncate col-md-10 offset-md-0 col-sm-6 '>{item.Date}</div>
            // </div>
        
            // </div>

}
export default Jobs;