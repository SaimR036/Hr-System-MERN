import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function ResumeItem({ resume }) {
    const [userName, setUserName] = useState();
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchUserName = async (uid) => {
            try {
                const response = await axios.get(`/user/${uid}`);
                console.log("Response data:", response.data); // Log response data
                const us = response.data.firstName;
                console.log("ussssss:", us)
                setUserName(response.data);
                setIsLoading(false); // Set loading state to false after fetching the username
            } catch (error) {
                console.error('Error fetching user name:', error);
                setIsLoading(false); // Set loading state to false even if there's an error
            }
        };
        

        if (resume.Userid) {
            fetchUserName(resume.Userid);
        }
    }, [resume.Userid]);

    return (
        <li key={resume._id}>
            {isLoading ? (
                <p>Loading...</p> // Display a loading indicator while fetching the username
            ) : (
                <>
                    <p>Name: {userName.firstName} {userName.lastName}</p>
                    <img src={resume.image} alt="resume" className="resume-img" style={{ width: '400px', height: 'auto' }} />
                </>
            )}
        </li>
    );
}
