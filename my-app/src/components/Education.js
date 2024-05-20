import React, { useState, useEffect } from 'react';
import '../CSS/UserProfile.css'
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import add from '../assets/add.png';
import del from '../assets/delete.png';


function Education({ user,displayButton}) {
    const [education, setEducation] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [startDate, setStartDate] = useState();
    const [institute, setInstitute] = useState("");
    const [degree, setDegree] = useState("");
    const [fieldOfStudy, setFieldOfStudy] = useState("");
    



    const [stm, setStm] = useState("");
    const [edm, setEdm] = useState("");

    const [ste, setSte] = useState("");
    const [ede, setEde] = useState("");

    
    const [showAll, setShowAll] = useState(false);
   
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get(`/education/${userid}`);
    //             setEducation(response.data);
    //             
                
    //             setLoading(false);
    //         } catch (error) {
    //             console.error('Error fetching educations:', error);
    //         }
    //     };
    
    //     fetchData();
    // }, [userid]);



    useEffect(() => {
        if (user && user.education) {
            setEducation(user.education);
        }
        else{
            setEducation([]); 
        }
    }, [user]);

    const handleAddPost = () => {
        setShowModal(true);
        // Add logic to handle creating a post
    };
    const formatDateRange = (startDate1, endDate1) => {
        // Parse startDate1 and endDate1 as Date objects if they are not already
        const startDate = startDate1 instanceof Date ? startDate1 : new Date(startDate1);
        const endDate = endDate1 instanceof Date ? endDate1 : new Date(endDate1);
    
        // Check if startDate and endDate are valid Date objects
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            const startFormatted = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            const endFormatted = endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            return `${startFormatted} - ${endFormatted}`;
        } else if (!isNaN(startDate.getTime()) && isNaN(endDate.getTime())) {
            const startFormatted = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            return `${startFormatted} - Present`;
        } else {
            // If neither start date nor end date is valid, return an empty string
            return '';
        }
    };
    
    
    const handleDelete = async (educationId) => {
        try {
            // Send a DELETE request to the server to delete the experience
            await axios.delete(`http://localhost:3001/education/${user._id}/${educationId}`);

            // Update the experiences state to remove the deleted experience
            setEducation(prevEducation => prevEducation.filter(exp => exp._id !== educationId));
        } catch (error) {
            console.error('Error deleting experience:', error);
            // Handle error if needed
        }
    };

    const handleAdd = async () => {
        try {
            setLoading(true);
            console.log(institute);
            console.log(stm);
            console.log(ste);
            console.log(edm);
            console.log(ede);
            
            

            const startDateString = `${ste}-${stm}`;
            // Format end date string as YYYY-MM-DD
            const endDateString = `${ede}-${edm}`;


            const requestBody = {
                institution: institute,
                degree: degree,
                startDate: startDateString,
                endDate: endDateString,
               fieldOfStudy: fieldOfStudy
            };
           
            const response = await axios.post(`http://localhost:3001/education/${user._id}`, requestBody);
            console.log(response)
            setEducation(prevEducation => [
                ...prevEducation,
                {
                    institution:  institute,
                degree: degree,
                startDate: startDateString,
                endDate: endDateString,
               fieldOfStudy: fieldOfStudy
                }
            ]);
            setLoading(false);

            setShowModal(false);

            // Optionally, you can update the UI to reflect the new experience
            // Fetch experiences again or update the state with the new experience
        } catch (error) {
            console.error('Error adding experience:', error);
            // Handle error if needed
        }

    }
    const handleShowAll = () => {
        setShowAll(true);
    };
    const displayPosts = showAll ? education : education.slice(0, 2);
    return (
        <div>
            <br />
            {!loading && education && (
                <div className="row">
                    <div className="col-lg-12 offset-lg-0 col-md-8 offset-md-2">

                        <div className="user-info-container experience-container">

                            <div className="user-details">

                                <div className='leftie'><h4>Education</h4>
                                <br/>
                                </div>
                                {displayButton && (
                                <div className='right'>
                                    <button className='editbtn' onClick={handleAddPost} ><img src={add} alt='edit' /></button>

                                    {/* Modal for adding a post */}
                                    <Modal show={showModal} onHide={() => setShowModal(false)} centered size='lg'>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Add an experience</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <label className='bold-label'>Institute:</label><br />
                                            <input type='text' className='full-width' value={institute} onChange={(e) => setInstitute(e.target.value)} />
                                            <br />
                                            <label className='bold-label'>Degree:</label><br />
                                            <input type='text' className='full-width' value={degree} onChange={(e) => setDegree(e.target.value)} />
                                            <br />
                                            <label className='bold-label'>Start Date:</label><br />

                                            <select className='half-width' name="startMonth" value={stm} onChange={(e) => setStm(e.target.value)} >

                                                <option value='' disabled selected>Month</option>
                                                <option value='01'>January</option>
                                                <option value='02'>February</option>
                                                <option value='03'>March</option>
                                                <option value='04'>April</option>
                                                <option value='05'>May</option>
                                                <option value='06'>June</option>
                                                <option value='07'>July</option>
                                                <option value='08'>August</option>
                                                <option value='09'>September</option>
                                                <option value='10'>October</option>
                                                <option value='11'>November</option>
                                                <option value='12'>December</option>
                                            </select>
                                            <select className='half-width' name="startYear" value={ste} onChange={(e) => setSte(e.target.value)} >
                                                <option value='' disabled selected>Year</option>
                                                {Array.from({ length: 35 }, (_, i) => (
                                                    <option key={1990 + i} value={1990 + i}>{1990 + i}</option>
                                                ))}
                                            </select>
                                            <br />
                                            <label className='bold-label'>End Date:</label><br />
                                            <select className='half-width' name="endMonth" value={edm} onChange={(e) => setEdm(e.target.value)} >
                                                <option value='' disabled selected>Month</option>
                                                <option value='01'>January</option>
                                                <option value='02'>February</option>
                                                <option value='03'>March</option>
                                                <option value='04'>April</option>
                                                <option value='05'>May</option>
                                                <option value='06'>June</option>
                                                <option value='07'>July</option>
                                                <option value='08'>August</option>
                                                <option value='09'>September</option>
                                                <option value='10'>October</option>
                                                <option value='11'>November</option>
                                                <option value='12'>December</option>
                                            </select>
                                            <select className='half-width' name="endYear" value={ede} onChange={(e) => setEde(e.target.value)}>
                                                <option value='' disabled selected>Year</option>
                                                {Array.from({ length: 35 }, (_, i) => (
                                                    <option key={1990 + i} value={1990 + i}>{1990 + i}</option>
                                                ))}
                                            </select>
                                            <br />
                                            <label className='bold-label'>Field of Study:</label><br />
                                            <input type='text' className='full-width' value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} />
                                        
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                                Close
                                            </Button>
                                            <Button variant="primary" onClick={handleAdd} >
                                                Add
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>


                                </div>)}
                            </div>


                            <div className='postcontent'>
                                
                                    <ul className="list-unstyled">
                                        {displayPosts.map((post, index) => (
                                            <li key={index} className='up'>

                                                <div className='list'>
                                                <div className='leftie'>
                                                    <p className='JobTitle'><b>{post.institution}</b> </p>
                                                    <p className='Company'>{post.degree}</p>
                                                    <p className='grey'>{formatDateRange(post.startDate, post.endDate)}</p>
                                                    <p className='grey'>{post.fieldOfStudy}</p>
                                                    
                                                </div>
                                                <div className='right'><br /> {displayButton && (
                                                    <button className='editbtn' onClick={() => handleDelete(post._id)}><img src={del} alt='edit' /></button>)}
                                                </div>
                                                </div>
                                                
                                                {index !== displayPosts.length - 1 && <hr />}
                                            </li>
                                        ))}
                                    </ul>
                                

                            </div>

                            {!showAll && !loading && education.length > 2 && (
                                <div className="text-center">
                                    <button className="showall" onClick={handleShowAll}>
                                        Show All Education -&gt;
                                    </button>
                                </div>
                            )}
                        </div>
                    </div></div>
            )}
            {loading && <p>Loading...</p>}
            {!loading && !education && <p>No user data available</p>}
        </div>
    )
}


export default Education