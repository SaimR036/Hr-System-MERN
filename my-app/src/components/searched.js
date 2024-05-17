import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { useEffect, useState } from 'react';
import  { useRef } from 'react';
import {uploadPost} from '../controllers/UsersC'
import { useLocation } from 'react-router-dom';
import { fetchSimilar } from '../controllers/UsersC';
import Navi from '../components/nav'
function Search()
{
  const location = useLocation();
  const { text} = location.state;
  const [value,setValue] = useState([])
    useEffect(()=>{
        var value1 = fetchSimilar(text)
        value1.then(result=>{
            console.log(result)
            var list = [];
            var scores=[]
        for(var val of result) {
            list.push(val['item']);
            scores.push(val['score'])
            }
            console.log(list,scores)
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
        console.log(list,scores)
        setValue(list)

        })

    },[])
    return(
        <>
        <Navi />
        
            <div className='col-4 container-fluid mt-4 container rounded bg-light' style={{ minHeight: '25vh' }}>
                {value.map((item, index) => (

                <div class='row' key={index} style={{ color:'gray',border:'2px solid  black',borderRadius:'20px',marginBottom:'20px'}}>
                <img src={item.Photo} style={{border:'1px solid black',marginLeft:'2px',marginBottom:'10px'}} className="w-15 h-20 mt-2 rounded-circle col-md-2 col-sm-2 col-2 col-lg-2 align-items-center" alt="Rounded" />
                
                <div className='col-md-6 truncate offset-md-0 col-6 col-sm-6 mt-2'>
                <div className='truncate col-md-10 offset-md-0 col-sm-6 '>{item.Name} </div>
                <div className='truncate col-md-10 offset-md-0 col-sm-6 '>{item.Headline}</div>
                </div>
            
                </div>
            ))}
            </div>
        
        
        
        </>
    )

}
export default Search;