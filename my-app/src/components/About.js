import React, { useState } from 'react';
import '../CSS/UserProfile.css';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import add from '../assets/add.png';
import del from '../assets/delete.png';

function About({ company }) {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="row">
      <div className="col-lg-12 offset-lg-0 col-md-8 offset-md-2">
        <div className="user-info-container experience-container">
          <h4>About</h4>
          <p>{company.overview}</p>

          <h6>Website</h6>
          <p>{company.websiteURL}</p>

          {/* Display the rest of the information only if showMore is true */}
          {showMore && (
            <>
              <h6>Company Size</h6>
              <p>
                {company.companySize
} Employees<br />{' '}
              </p>
              <h6>Head Quarters</h6>
              <p>
                {company.locations[0].address},{company.locations[0].city},
                {company.locations[0].country}
              </p>
              <h6>Founded</h6>
              <p>{company.founded}</p>
              <h6>Specialities</h6>
              {company.specialties && (
                <p>{company.specialties.join(', ')}</p>
              )}
            </>
          )}

          {/* Button to toggle showMore state */}
          <Button onClick={toggleShowMore} className="showall">
            {showMore ? 'Show Less' : 'Show More'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default About;
