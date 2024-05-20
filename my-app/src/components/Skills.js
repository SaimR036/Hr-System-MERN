import React, { useState, useEffect } from 'react';
import '../CSS/UserProfile.css';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import add from '../assets/add.png';
import del from '../assets/delete.png';

function Skills({ user,displayButton  }) {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newSkill, setNewSkill] = useState('');
    const [showAll, setShowAll] = useState(false);
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        if (user && user.skills) {
            setSkills(user.skills);
        }
    }, [user]);

    const handleAddPost = () => {
        setShowModal(true);
    };

    const handleDelete = async (skillToDelete) => {
        try {
            await axios.delete(`http://localhost:3001/skills/${user._id}/${skillToDelete}`);
            setSkills((prevSkills) => prevSkills.filter((skill) => skill !== skillToDelete));
        } catch (error) {
            console.error('Error deleting skill:', error);
        }
    };

    const handleAdd = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`http://localhost:3001/skills/${user._id}`, { skill: newSkill });
            setSkills((prevSkills) => [...prevSkills, newSkill]);
            setNewSkill('');
            setLoading(false);
            setShowModal(false);
        } catch (error) {
            console.error('Error adding skill:', error);
        }
    };

    const handleShowAll = () => {
        setShowAll(true);
    };

    const displaySkills = showAll ? skills : skills.slice(0, 2);

    return (
        <div>
            <br />
            {!loading && skills && (
                <div className="row">
                    <div className="col-lg-12 offset-lg-0 col-md-8 offset-md-2">
                        <div className="user-info-container experience-container">
                            <div className="user-details">
                                <div className="leftie">
                                    <h4>Skills</h4>
                                    <br />
                                </div>
                                {displayButton && (
                                <div className="right">
                                    <button className="editbtn" onClick={handleAddPost}>
                                        <img src={add} alt="edit" />
                                    </button>

                                    <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                                        <Modal.Header closeButton>
                                            <Modal.Title>Add a skill</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <label className="bold-label">Skill:</label>
                                            <br />
                                            <input type="text" className="full-width" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                                Close
                                            </Button>
                                            <Button variant="primary" onClick={handleAdd}>
                                                Add
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </div>)}
                            </div>
                            <div className="postcontent">
                                <ul className="list-unstyled">
                                    {displaySkills.map((skill, index) => (
                                        <li key={index}  className='up'>

                                            <div className="list" >
                                            <div className="leftie ">
                                                <p className="JobTitle">
                                                    <b>{skill}</b>
                                                </p>
                                            </div>
                                            <div className="right "><br/>
                                            {displayButton && (
                                                <button className="editbtn" onClick={() => handleDelete(skill)}>
                                                    <img src={del} alt="edit" />
                                                </button>)}
                                            </div>
                                            </div>
                                            
                                            {index !== displaySkills.length - 1 && <hr />}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {!showAll && !loading && skills.length > 2 && (
                                <div className="text-center">
                                    <button className="showall" onClick={handleShowAll}>
                                        Show All Skills -&gt;
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {loading && <p>Loading...</p>}
            {!loading && !skills && <p>No skills available</p>}
        </div>
    );
}

export default Skills;
