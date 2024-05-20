import React, { useEffect, useRef, useState } from 'react';
import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,ArcElement,Tooltip,Legend} from 'chart.js';
import {Line,Pie} from 'react-chartjs-2'
import adback from '../assets/adback.jpg'
import 'bootstrap/dist/css/bootstrap.min.css';
import { data,premdata,piedata } from './linedata.js';
import { text } from '@fortawesome/fontawesome-svg-core';
import { fetchAllUsers } from '../controllers/UsersC';
import {banUser,UnbanUser} from '../controllers/UsersC'
ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,ArcElement,Title,Tooltip,Legend);
function Dash() {
    const [data1,setData] = useState(null)
    const [users,Setuser] = useState(null)
    const handleBanToggle = (userId) => {
        // Assuming you have a state variable called 'users'
        const updatedUsers = users.map((user) => {
          if (user._id === userId) {
            return { ...user, ban: user.ban === 0 ? 1 : 0 };
          }
          return user;
        });
        // Update the state with the modified users array
        // (use your actual state management method here)
        Setuser(updatedUsers);
      };
    function ban(id)
    {
        banUser(id)
        handleBanToggle(id)
    }
    function unban(id)
    {
        UnbanUser(id)
        handleBanToggle(id)

    }
    
    useEffect(()=>{
        async function use()
        {
            var us = await fetchAllUsers()
            Setuser(us)
            console.log(us)
        }
        
       use()
        },[])
    const options={
        maintainAspectRatio: false,

        responsive:true,
        plugins:{
            title:{
                text:"Monthly Users",
                display:true,
                color: '#606060' // Change title color
            },

        },
        scales: {
            x: {
                ticks: {
                    color: '#606060' // Change x-axis labels color
                }
            },
            y: {
                ticks: {
                    color: '#606060' // Change y-axis labels color
                }
            }
        }
    }
    
    const options1={
        maintainAspectRatio: false,

        responsive:true,
        plugins:{

            title:{
                text:"Premium Users"
                ,display:true
            }
        }
    }
    const options2={
        maintainAspectRatio: false,

        responsive:true,
        plugins:{

            title:{
                text:"Domain coverage"
                ,display:true
            }
        }
    }
  return(
    <>
<div style={{ backgroundColor: '#003333', display: 'flex', flexDirection: 'column' ,minHeight:'737px'}}>
    <div className='col-4'>
        <p style={{color:'white', position:'absolute',marginLeft:'2px'}}>
            Admin Dashboard
        </p>

    </div>
    <div className='d-flex'>
    <div className='col-4' style={{position:'relative'}}>
    <div className='container-fluid mt-5 container rounded bg-green' style={{ marginLeft:'5px' }}>
            {users!=null && users.map((item, index) => (
        <div class='row ' key={index} style={{ color:'gray',border:'2px solid  black',borderRadius:'20px',marginBottom:'20px'}}>
            <img src={item.Photo} style={{marginLeft:'2px',marginBottom:'10px'}} className=" mt-2 rounded-circle col-md-2 col-sm-6 col-6 col-lg-2" alt="Rounded" />
            
            <div className='col-md-9 offset-md-0 col-12 col-sm-12 mt-2'>
                <div className='d-flex align-items-center'>
                    <div className='truncate col-md-7 offset-md-0 col-sm-9 col-9' style={{fontSize:'15px'}}>{item.Name}</div>
                    {item.ban==0?
                    <button style={{backgroundColor:'red'}} onClick={()=>{ban(item._id)}} className='col-3  col-sm-3 d-flex align-items-center justify-content-center offset-md-3 offset-sm-0.5 rounded'> Ban
                    </button>:<button style={{backgroundColor:'green'}}  onClick={()=>{unban(item._id)}} className='col-3   col-sm-3 d-flex align-items-center justify-content-center offset-md-3 offset-sm-0.5 rounded'>Unban</button>}
                </div>
                <div className='truncate col-md-7 offset-md-0 col-sm-6 ' style={{fontSize:'15px'}}>{item.Headline}</div>
            </div>
        </div>
    ))}
            </div>


    </div>
    <div className='row col-6 offset-md-3 col-sm-4 col-md-4 offset-sm-3 offset-1' >

    <div  className='col-12  col-sm-12 col-md-12 offset-sm-1 offset-0 ' style={{border:'2px solid blue', marginBottom:'40px',marginTop:'10px'}} >
    <Line  options={options} data={data}></Line>
    </div>
    <div className='col-12  col-sm-12 col-md-12 offset-sm-1 offset-0' style={{marginBottom:'40px',border:'2px solid green'}} >
    <Line options={options1} data={premdata}></Line>
    </div>

    <div className='col-12  col-sm-12 col-md-12 offset-sm-1 offset-0' style={{  border:'2px solid yellow'}}>

    <Pie style={{marginBottom:'10px'}} options={options2} data={piedata} />

    </div>
    </div>
    </div>
    </div>

    </>
  )
}

export default Dash;
