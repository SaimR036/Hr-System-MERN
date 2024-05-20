import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import './feed.css';
import image from '../assets/cat.jpg'; // Import your image from the assets folder
import hart from '../assets/heart.png'
import com from '../assets/com.png'
import share from '../assets/share.png'

import { useEffect, useState ,useRef} from 'react';

function Feed(props)
{
    const [users, setUsers] = useState([]);
    let url;

      useEffect(() => {
          //fetchImageData(imageId)
            // Fetch the image data from the backend when the component mounts
            
      }, []);

      
    let im = true;
    
    return (
        <div class="row mt-3">
        <div className="col-7 col-sm-7 col-md-5 container-fluid bg-light ml-auto rounded  container border" >
    
    <div class="row">
    <img src={props.Prof} style={{marginLeft:'2px'}} className="w-20 mt-2  col-md-2 col-sm-4 rounded-circle col-4 col-lg-2 align-items-center" alt="Rounded" />
    
    <div className='col-md-6 truncate offset-md-0 col-6 col-sm-6 mt-2'>
    <div className='truncate col-md-12 offset-md-0 col-sm-12 '>{props.Name} </div>
    <div className='truncate col-md-12 offset-md-0 col-sm-12 '>{props.Date}</div>
    </div>

    </div>
    <div style={{border:'0.5px inset #d3d3d3',marginTop:'8%',marginBottom:'2%'}}></div>
    <div className='mb-2'>{props.Desc}</div>
    {im && <img src={props.Image} style={{border:'1px solid black'}}  className='col-12 rounded mb-2' alt="Rounded" />}
    <div class="row">
    <button className="col-3 btn d-flex align-items-center justify-content-center" style={{height:'30px',marginBottom:'10px',marginLeft:'2px',width:'35px'}} ><img src={hart} style={{height:'100%'}} alt="Rounded" /></button>
    <button className="col-3 btn d-flex align-items-center justify-content-center" style={{height:'30px',marginBottom:'10px',marginLeft:'5px',width:'35px'}} ><img src={com} style={{height:'100%'}}  alt="Rounded" /></button>
    <button className="col-3 btn d-flex align-items-center justify-content-center" style={{height:'30px',marginBottom:'10px',marginLeft:'5px',width:'35px'}} ><img src={share} style={{height:'100%'}}  alt="Rounded" /></button>
    </div>
</div>

</div>
        )


        

    
}
export default Feed;