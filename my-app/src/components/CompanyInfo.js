import React from 'react';
import '../CSS/UserProfile.css'
import edit from '../assets/pencil.png'

function CompanyInfo({ company, loading,displayButton  }) {
    console.log("in companyInfo",company);
  
    return (
      <div>
        <br/>
        {company && (
          <div className="row">
          <div className="col-lg-12 offset-lg-0 col-md-8 offset-md-2">
  
              <div className="user-info-container experience-container">
                <div
                  className="background-image"
                  style={{ backgroundImage: `url(https://t3.ftcdn.net/jpg/00/86/56/12/360_F_86561234_8HJdzg2iBlPap18K38mbyetKfdw1oNrm.jpg)` }}
                >
                  <div className="profile-picture-container">
                    <img style={{borderRadius:'5px'}} src={company.logo} alt="Profile" className="profile-picture" />
                  </div>
                </div><br/>
                <div className="user-details">
  
  {console.log(company)}
                  <div className='leftie'>
                  <h2>{company.name}</h2><br/>
    <p className='Location'>{company.industry}-{company.locations[0].address}-{company.employeeInsights.totalEmployees} Employees</p>
    
                  {displayButton && (
                    <button className="btn btn-primary">Send Message</button>
                  )}
                  </div>
                  <div className='right'>
                  <button className='editbtn' ><img src={edit} alt='edit'/></button>
                  <br/>
                  <br/>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
export default CompanyInfo