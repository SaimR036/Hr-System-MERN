import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { fetchJobs } from '../controllers/UsersC';
import Navi from './nav'
import { jwtDecode } from 'jwt-decode';
export function Jobs()
{
    const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
    const [job,SetJobs]= useState([])
    const [image,SetImage] = useState(null)
    useEffect(()=>{
        async function fetchAndSetJobs() {
            var jobs = await fetchJobs(userId);
            SetJobs(jobs);
            console.log(jobs);
        }
        fetchAndSetJobs();
    },[])
    function check(e)
    {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        console.log('lololo')
        console.log(reader.result)
        SetImage(reader.result)
      }
      reader.onerror = error =>{
        console.log("Error: ",error);
      }
      
    }
    function subresume(id)
    {
    fetch('http://localhost:3001/subResume', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Specify the content type as JSON
        },
        body: JSON.stringify({Uid:id,image:image  }) // Include all arguments in the request body
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
    return(<>
        <Navi />
        
        <div className='col-md-5 col-sm-10 col-10 container-fluid mt-4 container rounded bg-light' style={{ minHeight: '25vh' }}>
            {job.map((item, index) => (
                

                <div class="row mt-3">
                <div className="col-12 col-sm-12 col-md-12 container-fluid bg-light ml-auto rounded  container border" >
            
            <div class="row ">            
            <div className='col-md-12 truncate offset-md-0 col-12 col-sm-12 mt-2 '>
            <div className='row d-flex'>
            <div className='truncate col-md-6 offset-md-0 col-sm-6 col-6'>{item['company']} </div>
   
            <input  onChange={check} className=' truncate col-md-3 offset-md-0 col-sm-3 col-3 mt-1' type="file" id="fileInput" accept="image/*"></input>
                <button  onClick={()=>{subresume(item['Uid'])}}   className='btn btn-primary truncate col-md-2 offset-md-0 col-sm-2 col-2'>Submit</button>

            </div>
            <div className='truncate col-md-12 offset-md-0 col-sm-12 '>{item['Date']}</div>
            </div>
        
            </div>
            <div style={{border:'0.5px inset #d3d3d3',marginTop:'8%',marginBottom:'2%'}}></div>
            <div className='mb-2'>{item['Description']}</div>
            {<img src={item['Image']} style={{border:'1px solid black'}}  className='col-12 rounded mb-2' alt="Rounded" />}
            </div>
            </div>
            
        ))}
        </div>
    
    
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