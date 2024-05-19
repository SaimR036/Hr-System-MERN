import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


export const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState('individual');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    location: '',
    industry: '',
    headline: '',
    companyName: '',
    Headline:'',
    companyLocations: [
      { address: '', city: '', state: '', zip: '', country: '' }
    ],
    companyIndustry: '',
    companySize: '',
    websiteURL: '',
    founded: '',
    type: '',
  });
  const [error, setError] = useState(null);
  const [image,SetImage] = useState(null);
    function check(e)
    {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        console.log('lololo')

        console.log(reader.result)
        SetImage(reader.result)
      }
      reader.onerror = error =>{
        console.log("Error: ",error);
      }
      
    }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLocationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedLocations = [...formData.companyLocations];
    updatedLocations[index] = {
      ...updatedLocations[index],
      [name]: value,
    };
    setFormData((prevState) => ({
      ...prevState,
      companyLocations: updatedLocations,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      let result;
      if (accountType === 'individual') {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.location || !formData.industry) {
          throw new Error("All compulsory fields must be filled.");
        }
        const postData = {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          location: formData.location,
          industry: formData.industry,
          Headline: formData.Profession,
          Photo: image,
        };
        
        try {
          const response = await fetch('http://localhost:3001/signup/person', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
          });
        
          if (response.ok) {
            // Handle successful response
            const data = await response.json();
            console.log('Response data:', data);
          } else {
            // Handle error response (e.g., non-200 status code)
            console.error('Error:', response.status);
          }
        } catch (error) {
          // Handle network errors or exceptions
          console.error('Fetch error:', error);
        }
        
      } else if (accountType === 'company') {
        if (!formData.companyName || !formData.companyLocations || !formData.companyIndustry || !formData.email || !formData.password) {
          throw new Error("All compulsory fields must be filled.");
        }
        result = await axios.post('http://localhost:3001/signup/company', {
          email: formData.email,
          password: formData.password,
          name: formData.companyName,
          locations: formData.companyLocations,
          industry: formData.companyIndustry,
          size: formData.companySize,
          websiteURL: formData.websiteURL,
          founded: formData.founded,
          type: formData.type,
        });
      }
  
      if (result.status === 201) {
        const userData = result.data;
        localStorage.setItem("userzs", JSON.stringify(userData));
        console.log(formData);
        navigate('/chat', { replace: true });
        alert('Signup successful');
      } else {
        const errorData = result.data;
        if (Array.isArray(errorData.error)) {
          setError(errorData.error.join(", "));
        } else {
          setError(errorData.error);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorData = error.response.data;
        setError(errorData.error);
        alert(errorData.error); // Show error message to the user
      } else {
        setError("An error occurred. Please try again."); // Generic error message
        alert("An error occurred. Please try again."); // Show generic error message to the user
      }
    }
  };
  
  
  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="container-fluid custom-bg-color position-absolute">
      <div className="custom-bg-color text-light py-4 mb-0 display-4 m-4">Proconnect+</div>

      <div className="signup d-flex justify-content-center align-items-center w-100 custom-text-color custom-bg-color mb-5" style={{ marginTop: '-80px' }}>
        <div className="w-1/2 p-4 rounded bg-light shadow-lg ml-auto">
          {step === 1 && (
            <div>
              <h3>Choose Account Type</h3>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="radio" 
                  name="accountType" 
                  id="individual" 
                  value="individual" 
                  checked={accountType === 'individual'} 
                  onChange={(e) => setAccountType(e.target.value)} 
                />
                <label className="form-check-label" htmlFor="individual">
                  Individual
                </label>
              </div>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="radio" 
                  name="accountType" 
                  id="company" 
                  value="company" 
                  checked={accountType === 'company'} 
                  onChange={(e) => setAccountType(e.target.value)} 
                />
                <label className="form-check-label" htmlFor="company">
                  Company
                </label>
              </div>
              <button className="btn btn-primary mt-3" onClick={nextStep}>Next</button>
            </div>
          )}
          {step === 2 && accountType === 'individual' && (
            <form onSubmit={handleSubmit}>
              <h3>Sign Up</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className='mb-2'>
                <label htmlFor='firstName'>First Name</label>
                <input
                  type='text'
                  name='firstName'
                  placeholder='Enter First Name'
                  className='form-control'
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className='mb-2'>
                <label htmlFor='lastName'>Last Name</label>
                <input
                  type='text'
                  name='lastName'
                  placeholder='Enter Last Name'
                  className='form-control'
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className='mb-2'>
                <label htmlFor='location'>Location</label>
                <input
                  type='text'
                  name='location'
                  placeholder='Enter Location'
                  className='form-control'
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              <div className='mb-2'>
                <label htmlFor='industry'>Industry</label>
                <input
                  type='text'
                  name='industry'
                  placeholder='Enter Industry'
                  className='form-control'
                  value={formData.industry}
                  onChange={handleChange}
                />
              </div>
              <div className='mb-2'>
                <label htmlFor='email'>Email</label>
                <input
                  type='email'
                  name='email'
                  placeholder='Enter Email'
                  className='form-control'
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className='mb-2'>
                <label htmlFor='password'>Password</label>
                <input
                  type='password'
                  name='password'
                  placeholder='Enter Password'
                  className='form-control'
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className='mb-2'>
                <label htmlFor='Profession'>Profession</label>
                <input
                  type='text'
                  name='Profession'
                  placeholder='Enter Profession'
                  className='form-control'
                  value={formData.Profession}
                  onChange={handleChange}
                />
              </div>
              <div> 
              
              <input accept="image/*" type="file" onChange={check}></input>
              
              </div>
              <div className='d-grid'>
                {step !== 1 && <button type='button' className='btn btn-secondary mr-2' onClick={prevStep}>Previous</button>}
                <button type='submit' className='btn btn-primary mt-1'>Sign Up</button>
              </div>
            </form>
          )}
          {step === 2 && accountType === 'company' && (
            <form onSubmit={handleSubmit}>
              <h3>Company Sign Up</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className='mb-2'>
                <label htmlFor='companyName'>Company Name</label>
                <input
                  type='text'
                  name='companyName'
                  placeholder='Enter Company Name'
                  className='form-control'
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>
              <div className='mb-2'>
                <label htmlFor='companyIndustry'>Company Industry</label>
                <input
                  type='text'
                  name='companyIndustry'
                  placeholder='Enter Company Industry'
                  className='form-control'
                  value={formData.companyIndustry}
                  onChange={handleChange}
                />
              </div>
              <div className='mb-2'>
                <label htmlFor='companySize'>Company Size</label>
                <input
                  type='text'
                  name='companySize'
                  placeholder='Enter Company Size'
                  className='form-control'
                  value={formData.companySize}
                  onChange={handleChange}
                />
              </div>
              <div className='mb-2'>
                <label htmlFor='websiteURL'>Website URL</label>
                <input
                  type='text'
                  name='websiteURL'
                  placeholder='Enter Website URL'
                  className='form-control'
                  value={formData.websiteURL}
                  onChange={handleChange}
                />
              </div>
              <div className='mb-2'>
                <label htmlFor='email'>Email</label>
                <input
                  type='email'
                  name='email'
                  placeholder='Enter Email'
                  className='form-control'
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className='mb-2'>
                <label htmlFor='password'>Password</label>
                <input
                  type='password'
                  name='password'
                  placeholder='Enter Password'
                  className='form-control'
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className='d-grid'>
                {step !== 1 && <button type='button' className='btn btn-secondary mr-2' onClick={prevStep}>Previous</button>}
                <button className="btn btn-primary mt-3" onClick={nextStep}>Next</button>
                <button type='submit' className='btn btn-primary mt-1'>Sign Up</button>
              </div>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <h3>Company Information (Step 2)</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className='mb-2'>
                <label htmlFor='founded'>Founded Year</label>
                <input
                  type='number'
                  name='founded'
                  placeholder='Enter Founded Year'
                  className='form-control'
                  value={formData.founded}
                  onChange={handleChange}
                />
              </div>
              <div className='mb-2'>
                <label htmlFor='type'>Type</label>
                <input
                  type='text'
                  name='type'
                  placeholder='Enter Type'
                  className='form-control'
                  value={formData.type}
                  onChange={handleChange}
                />
              </div>
              <div className='mb-2'>
                <label htmlFor='companyLocationAddress'>Company Location Address</label>
                <input
                  type='text'
                  name='address'
                  placeholder='Enter Company Location Address'
                  className='form-control'
                  value={formData.companyLocations[0].address}
                  onChange={(e) => handleLocationChange(0, e)}
                />
              </div>
              <div className='mb-2'>
                <label htmlFor='companyLocationCity'>Company Location City</label>
                <input
                  type='text'
                  name='city'
                  placeholder='Enter Company Location City'
                  className='form-control'
                  value={formData.companyLocations[0].city}
                  onChange={(e) => handleLocationChange(0, e)}
                />
              </div>
              <div className='mb-2'>
                <label htmlFor='companyLocationState'>Company Location State</label>
                <input
                  type='text'
                  name='state'
                  placeholder='Enter Company Location State'
                  className='form-control'
                  value={formData.companyLocations[0].state}
                  onChange={(e) => handleLocationChange(0, e)}
                />
              </div>
              <div className='mb-2'>
                <label htmlFor='companyLocationZip'>Company Location Zip</label>
                <input
                  type='text'
                  name='zip'
                  placeholder='Enter Company Location Zip'
                  className='form-control'
                  value={formData.companyLocations[0].zip}
                  onChange={(e) => handleLocationChange(0, e)}
                />
              </div>
              <div className='mb-2'>
                <label htmlFor='companyLocationCountry'>Company Location Country</label>
                <input
                  type='text'
                  name='country'
                  placeholder='Enter Company Location Country'
                  className='form-control'
                  value={formData.companyLocations[0].country}
                  onChange={(e) => handleLocationChange(0, e)}
                />
              </div>
              <div className='d-grid'>
                <button type='button' className='btn btn-secondary mr-2' onClick={prevStep}>Previous</button>
                <button type='submit' className='btn btn-primary mt-1'>Sign Up</button>
              </div>
            </form>
          )}
          <div>
            <p>Already have an account? <Link to='/login'>Sign In</Link> </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
