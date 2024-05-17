import React, { useEffect, useRef, useState } from 'react';
import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,ArcElement,Tooltip,Legend} from 'chart.js';
import {Line,Pie} from 'react-chartjs-2'
import adback from './adback.jpg'
import 'bootstrap/dist/css/bootstrap.min.css';
import { data,premdata,piedata } from './linedata';
import { text } from '@fortawesome/fontawesome-svg-core';
ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,ArcElement,Title,Tooltip,Legend);
function Dash() {
    const [data1,setData] = useState(null)
    useEffect(()=>{
        fetch('/getrec')
        .then(res => {
            if (!res.ok) { 
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data1 => {
            setData(data1['members']);
            console.log(data1);
        })
        .catch(error => {
            console.error('Error:', error);
        });
        },[])
    const options={
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
        responsive:true,
        plugins:{

            title:{
                text:"Premium Users"
                ,display:true
            }
        }
    }
    const options2={
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
        <div style={{backgroundColor:'#003333', position:'relative', height:'100vh'}}>

    <div>
        <p style={{color:'white', position:'absolute', fontSize:'20px',marginLeft:'2px'}}>
            Admin Dashboard
        </p>

    </div>
    <button className='btn' style={{position:'absolute',marginTop:'5%',marginLeft:'2%', color:'white'}}>Ban a User</button>
    <div style={{position:'absolute',marginLeft:'18%', border:'1px solid gray',height:'430px',width:'2px',marginTop:'20px',marginBottom:'20px'}}></div>
    <div style={{marginTop:'10px', position:'absolute', border:'2px solid blue', marginLeft:'21%',display:'inline-flex',  width:'400px',height:'200px'}} >
    <Line options={options} data={data}></Line>
    <Line options={options1} style={{border:'2px solid green',marginLeft:'15px',height:'200px',marginRight:'2px'}}data={premdata}></Line>
    </div>
    <div style={{ marginTop:'212px',position:'absolute', border:'2px solid yellow',marginLeft:'48%', width:'250px',height:'258px'}} >

    <Pie options={options2} data={piedata} />

    </div>
    </div>

    </>
  )
}

export default Dash;
