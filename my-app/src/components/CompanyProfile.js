import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/UserProfile.css';
import About from './About';
import CompanyInfo from './CompanyInfo';
import Img from './Profimg';
import Cposts from './CPPosts';
import JobPosting from './JobPost'
function CompanyProfile() {
    const userid ='664861e6bba992029d30e41e'
    const displayButton= true
    const [company, setCompany] = useState({});
    const [loading, setLoading] = useState(true);
    const [companyId, setCompanyID] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/company/${userid}`);
                setCompany(response.data);
                setCompanyID(response.data._id);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching company data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [userid]);

    return (
        <div className="container-custom col">
            <div className="row">
                <div className="col-md-9">
                    {!loading ? (
                        <>
                            <CompanyInfo
                                company={company}
                                loading={loading}
                                displayButton={displayButton}
                                style={{ backgroundColor: 'rgb(243, 243, 243)' }}
                            />
                            <br />
                            <About company={company} />
                            {console.log(company._id)}<br />
                            <Cposts userid={companyId} loading={loading} displayButton={displayButton} />

                            <JobPosting company={company} displayButton={displayButton}  />
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
