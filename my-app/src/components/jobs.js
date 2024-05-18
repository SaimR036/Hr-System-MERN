import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { fetchJobs } from '../controllers/UsersC';
import Navi from './nav'
export function Jobs()
{
    const [job,SetJobs]= useState([])
    useEffect(()=>{
        async function fetchAndSetJobs() {
            var jobs = await fetchJobs('6640b7ea0f28db8bb8dc6bb3');
            SetJobs(jobs);
            console.log(jobs);
        }
        fetchAndSetJobs();
    },[])

    return(<>
        <Navi />
        
        <div className='col-4 container-fluid mt-4 container rounded bg-light' style={{ minHeight: '25vh' }}>
            {job.map((item, index) => (

            <div class='row' key={index} style={{ color:'gray',border:'2px solid  black',borderRadius:'20px',marginBottom:'20px'}}>
            <img src={item.Image} style={{border:'1px solid black',marginLeft:'2px',marginBottom:'10px'}} className="w-15 h-20 mt-2 rounded-circle col-md-2 col-sm-2 col-2 col-lg-2 align-items-center" alt="Rounded" />
            
            <div className='col-md-6 truncate offset-md-0 col-6 col-sm-6 mt-2'>
            <div className='truncate col-md-10 offset-md-0 col-sm-6 '>{item.Description} </div>
            <div className='truncate col-md-10 offset-md-0 col-sm-6 '>{item.Date}</div>
            </div>
        
            </div>
        ))}
        </div>
    
    
    </>)


}
export default Jobs;