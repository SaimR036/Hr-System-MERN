import axios from 'axios';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

export const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:3001/login', formData, { withCredentials: true });
            const token = response.data.token;
            localStorage.setItem('token', token);
            setIsLoggedIn(true);
            navigate('/Home', { replace: true });
            alert('Login successful');
        } catch (error) {
            console.error('Login Error:', error);
            setError(error.response ? error.response.data.error : 'An error occurred during login');
            alert('An error occurred during login');
        }
    };

    if (isLoggedIn) {
        navigate('/', { replace: true });
    }

    return (
        <div className="container-fluid custom-bg-color position-absolute">
            <div className="custom-bg-color text-light py-4 mb-0 display-4 m-4"> Proconnect+</div>
            <div className='login d-flex justify-content-center align-items-center w-100 vh-100 custom-text-color custom-bg-color mb-5' style={{ marginTop: '-80px' }}>
                <div className='w-40 p-5 rounded bg-light shadow-lg ml-auto'>
                    <form onSubmit={handleSubmit}>
                        <h3>Sign IN</h3>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className='mb-2'>
                            <label htmlFor='email'>Email</label>
                            <input 
                                type='email' 
                                name='email' 
                                placeholder='Enter Email' 
                                className='form-control'  
                                value={formData.email} 
                                onChange={handleChange}  
                                ref={emailInputRef}
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
                                ref={passwordInputRef}
                            />
                        </div>
                        <div>
                            <input type='checkbox' className='custom-control custom-checkbox' id='check' />
                            <label htmlFor='check' className='custom-input-label'>
                                Remember me
                            </label>
                        </div>
                        <div className='d-grid'>
                            <button type="submit" className='btn btn-primary'>Sign In</button>
                        </div>
                        <p className='text-right'>
                            <Link to='#'>Forgot password?</Link>
                        </p>
                        <div>
                            <p>Don't have an account? <Link to='/Signup'>Sign up</Link> </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
