import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import post from '../assets/post.png'
import { useEffect, useState } from 'react';
import  { useRef } from 'react';
import {remReq, uploadPost} from '../controllers/UsersC'
import net from '../assets/nett.png'
import jobs from '../assets/jobs.png'
import Navi from '../components/nav'
import { getPending,fetchWholeFriends } from '../controllers/UsersC';
import cross from '../assets/cross.png'
import tick from '../assets/tick.png'
import { jwtDecode } from 'jwt-decode';

import { makeFriend } from '../controllers/UsersC';
import {Link,useNavigate,Router} from 'react-router-dom'
export function MyNetwork()
{   
    const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const id = decodedToken.userId; 
    const [pends,Setpends]  = useState([])
    const [dum,setDum] = useState(0)
    const [friends,SetFriends] = useState([])
    useEffect(()=>{
      async function getData(id)
      {
        var val = await getPending(id)
        Setpends(val)
        var friends = await fetchWholeFriends(id)
        console.log(friends)
        SetFriends(friends)
      }
        getData(id)
        console.log(dum)
    },[])
    async function remove(Rid)
    {
        await remReq(Rid,id)
        Setpends(prevPends => prevPends.filter(item => item._id !== Rid));

    }
    async function add(Rid)
    {
        await makeFriend(id,Rid)
        await remReq(Rid,id)
        Setpends(prevPends => prevPends.filter(item => item._id !== Rid));

    }
    if (pends==null)
        {
            return(<>Loading...</>)
        }
        else{
    return(<>
       <Navi />
        
        <div className='col-6 container-fluid mt-4 container rounded bg-light' style={{ minHeight: '25vh' }}>
        {pends.map((item, index) => (
    <div class='row ' key={index} style={{ color:'gray',border:'2px solid  black',borderRadius:'20px',marginBottom:'20px'}}>
        <img src={item.Photo} style={{border:'1px solid black',marginLeft:'2px',marginBottom:'10px'}} className=" mt-2 col-md-2 col-sm-2 col-2 col-lg-2 align-items-center" alt="Rounded" />
        
        <div className='col-md-9 truncate offset-md-0 col-9 col-sm-6 mt-2'>
            <div className='d-flex align-items-center'>
                <div className='truncate col-md-7 offset-md-0 col-sm-6 '>{item.Name}</div>
                <button onClick={()=>{remove(item._id)}} className='col-1 d-flex align-items-center justify-content-center offset-md-1 rounded'> 
                        <img src ={cross} style={{width:'20px'}}></img>
                    </button>
                    <button onClick={()=>{add(item._id)}} className='col-1 d-flex align-items-center justify-content-center offset-md-1 rounded'> 
                        <img src ={tick} style={{width:'20px'}}></img>
                    </button>
            </div>
            <div className='truncate col-md-7 offset-md-0 col-sm-6 '>{item.Headline}</div>
        </div>
    </div>
))}
        </div>

    
    <div className='row'>
    <div className='col-6 d-flex align-items-center justify-content-center offset-md-3 rounded'  style={{height:'5px',backgroundColor:'gray'}}></div>

    </div>
    <div className='col-6 container-fluid mt-4 container rounded bg-light' style={{ minHeight: '25vh' }}>
        {friends.map((item, index) => (
    <div class='row ' key={index} style={{ color:'gray',border:'2px solid  black',borderRadius:'20px',marginBottom:'20px'}}>
        <img src={item.Photo} style={{border:'1px solid black',marginLeft:'2px',marginBottom:'10px'}} className=" mt-2 col-md-2 col-sm-2 col-2 col-lg-2 align-items-center" alt="Rounded" />
        
        <div className='col-md-9 truncate offset-md-0 col-9 col-sm-6 mt-2'>
            <div className='d-flex align-items-center'>
                <div className='truncate col-md-7 offset-md-0 col-sm-6 '>{item.Name}</div>
                
            </div>
            <div className='truncate col-md-7 offset-md-0 col-sm-6 '>{item.Headline}</div>
        </div>
    </div>
))}
        </div>
    </>)}

}
export default MyNetwork;