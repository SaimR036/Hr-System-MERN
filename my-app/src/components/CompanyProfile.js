import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/UserProfile.css';
import About from './About';
import CompanyInfo from './CompanyInfo';
import Img from './Profimg';
import Cposts from './CPPosts';
import JobPosting from './JobPost';

function CompanyProfile({ userid, display }) {
    const [company, setCompany] = useState({});
    const [loading, setLoading] = useState(true); // Initially set loading to true
    const [companyId, setCompanyID] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching company data for ID:", userid);
                const response = await axios.get(`http://localhost:3001/company/${userid}`);
                setCompany(response.data);
                setCompanyID(response.data._id);
                setLoading(false); // Set loading to false when data is fetched
            } catch (error) {
                console.error('Error fetching company data:', error);
                setLoading(false); // Set loading to false in case of error
            }
        };

        fetchData();
    }, [userid]); // Include userid in the dependency array

    return (
        <div className="container-custom col">
            <div className="row">
                <div className="col-md-9">
                    {!loading ? (
                        <>
                            <CompanyInfo
                                company={company}
                                loading={loading}
                                displayButton={display}
                                style={{ backgroundColor: 'rgb(243, 243, 243)' }}
                            />
                            <br />
                            <About company={company} />
                            <br />
                            <Cposts userid={companyId} loading={loading} displayButton={display} />
                            <JobPosting company={company} displayButton={display} />
                        </>
                    ) : (
                        <p>Loading...</p> // Placeholder for loading indicator
                    )}
                </div>
                <div className="col-md-3">
                    <Img />
                </div>
            </div>
        </div>
    );
}

export default CompanyProfile;
