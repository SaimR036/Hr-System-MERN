import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { useEffect, useState } from 'react';
import  { useRef } from 'react';
import {uploadPost} from '../controllers/UsersC'
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchSimilar } from '../controllers/UsersC';
import Navi from '../components/nav'
import add from '../assets/add.jpg'
import fri from '../assets/fri.png'
import pend from '../assets/pend.webp'
import tick from '../assets/tick.png'
import {remReq,sendreq,remFriend} from '../controllers/UsersC'
import { jwtDecode } from 'jwt-decode';

function Search()
{
  const navigate = useNavigate();
  const location = useLocation();
  const { text} = location.state;
  const [value,setValue] = useState([])
  function navig(uid)
  {
    console.log('lop',uid)
    navigate(`/other/${uid}`, { state: { id:uid,display:false } })
  }
    useEffect(()=>{
        var value1 = fetchSimilar(text)
        value1.then(result=>{
            var list = [];
            var scores=[]
        for(var val of result) {
            var newItem = {
                ...val['item'],  // spread the properties of val['item'] into the new object
                flag: val['flag']  // add the 'flag' property to the new object
            };
            list.push(newItem);
            scores.push(val['score'])
            }
        for(var i=0;i<list.length-1;i++)
            for(var j=0;j<list.length-1;j++)
        {
            if (scores[j]<scores[j+1])
            {
                var temp = list[j]
                list[j]=list[j+1]
                list[j+1] = temp
                var temp1 = scores[j]
                scores[j]=scores[j+1]
                scores[j+1] = temp1
            }
        }
        setValue(list)
        console.log(list)
        })

    },[])
    function updateFlag(id, newFlag) {
        setValue(prevValue => prevValue.map(item => item._id === id ? {...item, flag: newFlag} : item));
      }
      
    function req(flag,id)
    {
        const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const Sid = decodedToken.userId;
        if(flag==0)
            {

            }
            else if(flag==1)
                {
                    remReq(Sid,id)
                    updateFlag(id,-1);
                }
                else if(flag==2)
                    {
                        remFriend(Sid,id)
                        updateFlag(id, -1);
                    }
                    else{
                        sendreq(Sid,id)
                        updateFlag(id, 1);
                    }
    }
    return(
        <>
        <Navi />
        
            <div className='col-7 col-sm-7 col-md-5 container-fluid bg-light ml-auto rounded  container border' style={{ minHeight: '25vh' }}>
            {value.map((item, index) => (
                  
        <div class='row '  key={index} style={{ color:'gray',border:'2px solid  black',borderRadius:'20px',marginBottom:'20px'}}>
            <img src={item.Photo} style={{marginLeft:'2px',marginBottom:'10px'}} className="mt-2  col-md-2 col-sm-4 rounded-circle col-4 col-lg-2 align-items-center" alt="Rounded" />
            
            <div className='col-md-9 truncate offset-md-0 col-9 col-sm-9 mt-1'>
                <div className='d-flex align-items-center'>
                    <a className=' truncate col-md-7 offset-md-0 col-sm-7 '>{item.Name}</a>
                    {item.flag==0?
                    <p className='col-2 d-flex offset-3 align-items-center justify-content-center offset-md-2 rounded'>Invited</p>:
                    <button onClick={() => req(item.flag,item._id)} className='col-2 offset-3 d-flex align-items-center justify-content-center offset-md-3 rounded'> 
                        <img src ={item.flag==2?fri:item.flag==1?pend:add} style={{width:'20px'}}></img>
                    </button>}
                </div>
                <div className='truncate col-md-7 offset-md-0 col-sm-6 '>{item.Headline}</div>
            </div>
        </div>
    ))}
            </div>
        
        
        
        </>
    )

}
export default Search;