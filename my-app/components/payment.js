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

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripePromise = loadStripe("pk_test_51LaJyyJRoEbhRvRPnB7q0aRrWVnaPjhNhYrv5sszPpW0CUYyzt5HSTp3PKKWsIWyGDdkBUyC3jBC2XLGlOcPnXYK00MZLwlmjj");



const Payment = () => {
  return (
    <div className="App">
      
    </div>
  )
}

export default Payment;