
import React, { useCallback, useState, useEffect } from "react";
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import {Link,useNavigate} from 'react-router-dom'
import { setPrem } from "../controllers/UsersC";
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripePromise = loadStripe("pk_test_51LaJyyJRoEbhRvRPnB7q0aRrWVnaPjhNhYrv5sszPpW0CUYyzt5HSTp3PKKWsIWyGDdkBUyC3jBC2XLGlOcPnXYK00MZLwlmjj");


const Return = () => {
  const id = '6640b7ea0f28db8bb8dc6bb3'
  const navigate = useNavigate();
  function goto()
  {
    navigate('/')
  }
    const [status, setStatus] = useState(null);
    const [customerEmail, setCustomerEmail] = useState('');
  
    useEffect(() => {
      async function po()
      {
      await setPrem(id)
      }
      po()
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const sessionId = urlParams.get('session_id');
  
      fetch(`/session-status?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setStatus(data.status);
          setCustomerEmail(data.customer_email);
        });
    }, []);
  
    if (status === 'open') {
      return (
        <Navigate to="/checkout" />
      )
    }
  
    if (status === 'complete') {
      return (
        <section id="success">
          <p>
            We appreciate your business! A confirmation email will be sent to {customerEmail}.
  
            If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
          </p>
        </section>
      )
    }
  
    return <>Thank you for the purchase <button onClick={goto}> Home</button></>;
  }
  export default Return;