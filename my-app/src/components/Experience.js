import React, { useState, useEffect } from 'react';
import '../CSS/UserProfile.css'
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import add from '../assets/add.png';
import del from '../assets/delete.png';

function Experience({ user,displayButton   }) {
    const [experience, setExperiences] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [startDate, setStartDate] = useState("");
    const [description, setDescription] = useState("");



    const [stm, setStm] = useState("");
    const [edm, setEdm] = useState("");

    const [ste, setSte] = useState("");
    const [ede, setEde] = useState("");





    const [location, setLocation] = useState("");
    const [locationType, setLocationType] = useState("");

    const [showAll, setShowAll] = useState(false);
    // useEffect(() => {
    //     const fetchExperiences = async () => {
    //         try {
    //             const response = await axios.get(`/experience/${userid}`);
    //             setExperiences(response.data);
    //             setLoading(false);
    //         } catch (error) {
    //             console.error('Error fetching experiences:', error);
    //         }
    //     };

    //     fetchExperiences();
    // }, [userid]);



    useEffect(() => {
        if (user && user.experience) {
            setExperiences(user.experience);
        }
        else{
            setExperiences([]); 
        }
    }, [user]);


    const handleAddPost = () => {
        setShowModal(true);
        // Add logic to handle creating a post
    };
    const formatDateRange = (startDate1, endDate1) => {
        console.log(startDate1);

        // Check if startDate1 and endDate1 are Date objects
        if (startDate1 && endDate1) {

            return `${startDate1} - ${endDate1}`;
        } else if (startDate1 && !endDate1) {
            return `${startDate1} - Present`;
        } else {
            // If neither start date nor end date is defined
            return '';
        }
    };
    const handleDelete = async (experienceId) => {
        try {
            // Send a DELETE request to the server to delete the experience
            await axios.delete(`http://localhost:3001/experience/${user._id}/${experienceId}`);

            // Update the experiences state to remove the deleted experience
            setExperiences(prevExperiences => prevExperiences.filter(exp => exp._id !== experienceId));
        } catch (error) {
            console.error('Error deleting experience:', error);
            // Handle error if needed
        }
    };

    const handleAdd = async () => {
        try {
            setLoading(true);

            console.log(title);
            console.log(company);
            console.log(stm);
            console.log(ste);
            console.log(edm);
            console.log(ede);

            console.log(location);
            console.log(locationType);
            console.log(description);

            const startDateString = `${stm} ${ste}`;
            setStartDate(startDateString);

            console.log("start Date = ",startDate)
   
    
            const endDateString = `${edm} ${ede}`;


            const requestBody = {
                title: title,
                company: company,
                startDate: startDateString,
                endDate: endDateString,
                location: location,
                locationType: locationType,
                description: description
            };
           
            const response = await axios.post(`http://localhost:3001/experience/${user._id}`, requestBody);
            console.log(response)
            setExperiences(prevExperiences => [
                ...prevExperiences,
                {
                    title: title,
                    company: company,
                    startDate: startDateString,
                    endDate: endDateString,
                    location: location,
                    locationType: locationType,
                    description: description
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
    const displayPosts = showAll ? experience : experience.slice(0, 2);
    return (
        <div >
            <br />
            {!loading && experience && (
                <div className="row "  >
                    <div className="col-lg-12 offset-lg-0 col-md-8 offset-md-2 " >

                        <div className="user-info-container experience-container" >

                            <div className="user-details  " >

                                <div className='leftie'><h4>Experiences</h4>
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
                                            <label className='bold-label'>Title :</label><br />
                                            <input type='text' className='full-width' value={title} onChange={(e) => setTitle(e.target.value)} />
                                            <br />
                                            <label className='bold-label'>Company name:</label><br />
                                            <input type='text' className='full-width' value={company} onChange={(e) => setCompany(e.target.value)} />
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
                                            <label className='bold-label'>Location:</label><br />
                                            <input type='text' className='full-width' value={location} onChange={(e) => setLocation(e.target.value)} />
                                            <br />
                                            <label className='bold-label'>Location Type:</label><br />
                                            <select className='full-width' value={locationType} onChange={(e) => setLocationType(e.target.value)}>
                                                <option value='On-site'>On-site</option>
                                                <option value='Hybrid'>Hybrid</option>
                                                <option value='Remote'>Remote</option>
                                            </select>
                                            <br />
                                            <label className='bold-label'>Description</label><br />
                                            <input type='text' className='full-width' value={description} onChange={(e) => setDescription(e.target.value)} />

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
                                {loading ? (
                                    <p>Loading...</p>
                                ) : (
                                    <ul className="list-unstyled">
                                        {displayPosts.map((post, index) => (
                                            <li key={post._id} className='up'>

                                                <div className='list'>
                                                <div className='leftie'>
                                                    <p className='JobTitle'><b>{post.title}</b> </p>
                                                    <p className='Company'>{post.company}</p>
                                                    <p className='grey'>{formatDateRange(post.startDate, post.endDate)}</p>
                                                    <p className='grey'>{post.location}.{post.locationType}</p>
                                                </div>
                                                <div className='right'><br />{displayButton && (
                                                    <button className='editbtn' onClick={() => handleDelete(post._id)}><img src={del} alt='edit' /></button>
                                                 )} </div>

                                                </div>
                                                


                                                {/* Add additional post details as needed */}
                                                {index !== displayPosts.length - 1 && <hr />}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                            </div>

                            {!showAll && !loading && experience.length > 2 && (
                                <div className="text-center">
                                    <button className="showall" onClick={() => setShowAll(true)}>Show All Posts -&gt;</button>
                                </div>
                            )}
                        </div>
                    </div></div>
            )}
            {loading && <p>Loading...</p>}
            {!loading && !experience && <p>No user data available</p>}
        </div>
    )
}
export default Experience