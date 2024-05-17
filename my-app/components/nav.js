import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import post from './post.png'
import { useEffect, useState } from 'react';
import  { useRef } from 'react';
import {uploadPost} from './controllers/UsersC'
import net from './nett.png'
import jobs from './jobs.png'
import {Link,useNavigate,Router} from 'react-router-dom'
function Navi()
{
  const inputRef = useRef();

    const navigate = useNavigate()
    function nav()
    {
      var val = inputRef.current.value;
      navigate('/search',{ state: { text: val } })
    }
    const textAreaRef = useRef();
    const [image,SetImage] = useState(null);
    const [showpost,Setpost] = useState(false);
    function check(e)
    {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        console.log('lololo')
        const textAreaValue = textAreaRef.current.value;
        const Uid='66431ebfefaafd854aa6aa0c'
        console.log(reader.result)
        SetImage(reader.result)
      }
      reader.onerror = error =>{
        console.log("Error: ",error);
      }
      
    }
    function change()
    {   
        if(showpost)
            {
        Setpost(false);
            }else{
                Setpost(true)
        }
    }
    const handle = (event) => {
        event.preventDefault();
        console.log('lololo1')

        const textAreaValue = textAreaRef.current.value;
        const Uid='66431ebfefaafd854aa6aa0c'
        uploadPost(textAreaValue,image,Uid);
        // Now you can use textAreaValue in your code
      };
      const handleClick = () => {
        //navigate('/search', { replace: true });
      };
      <Router>
            navigate  = useNavigate();

      </Router>
    return(
        <>
        
<nav class="navbar navbar-expand-lg navbar-light bg-primary">
    
  <div class="container-fluid">
    <a class="navbar-brand" href="#">PC+</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button> 
    
    <div class="collapse navbar-collapse justify-content-between" id="navbarNav">
    <form class="">
      
     <input id='sea' ref={inputRef} class=" mr-sm-2" type="search" placeholder="Search" aria-label="Search"></input>
    
    <button onClick={nav}  class="btn btn-outline-success my-2 my-sm-0" style={{marginLeft:'5px'}} type="submit">Search</button>
    
  </form>
      <ul class="navbar-nav">
      <li class="nav-item active">
    <button className='btn '>
    <div className="d-flex flex-column align-items-center">
    <span className="col-3 d-flex align-items-center justify-content-center" onClick={change} style={{ height: '25px', width: '25px' }}>
      <img src={post} style={{ height: '100%' }} alt="Rounded" />
    
    </span>
    <p style={{ fontSize:'12px' }} className="m-0">Post</p>
  </div>
  </button>
  </li>
  <button className='btn '>
    <div className="d-flex flex-column align-items-center">
    <span className="col-3 d-flex align-items-center justify-content-center"  style={{ height: '25px', width: '25px' }}>
      <img src={net} style={{ height: '100%' }} alt="Rounded" />
    
    </span>
    <p style={{ fontSize:'12px' }} className="m-0">Network</p>
  </div>
  </button>
  <button className='btn '>
    <div className="d-flex flex-column align-items-center">
    <span className="col-3 d-flex align-items-center justify-content-center"  style={{ height: '25px', width: '25px' }}>
      <img src={jobs} style={{ height: '100%' }} alt="Rounded" />
    
    </span>
    <p style={{ fontSize:'12px' }} className="m-0">Jobs</p>
  </div>
  </button>
       
      </ul>
    </div>
  </div>
</nav>


{
showpost&&
<div style={{backgroundColor:'white',marginLeft:'25%',position:'absolute',   border:'1px solid black',borderRadius:'5px', height:'50%',width:'50%'}}><p>Create Post</p>
<form onSubmit={handle}>
<textarea ref={textAreaRef} style={{width:'100%',height:'60%',resize:'none'}} placeholder='What do you want to write?' wrap="soft"></textarea>

<input accept="image/*" type="file" onChange={check}></input>
<button type="submit">Submit</button>

</form>
</div>
}
</>


)
}
export default Navi;
