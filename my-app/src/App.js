import 'bootstrap/dist/css/bootstrap.min.css';
import Feed from './components/feed';
import { fetchUsers,fetchPosts,fetchFriends } from './controllers/UsersC';
import { useEffect, useState } from 'react';
import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
 import Dash from './components/Dash'
 import Home from './components/Home'
 import Search from './components/searched'
import Navi from './components/nav'
import Payment from './components/payment'
import CheckoutForm from './components/checkout'
import Return from './components/Return'
export function App() {
 
  return (
    <>
    
    <BrowserRouter>
    <Routes>
    
    <Route path='/search' element={<Search/>}></Route>
    <Route path='/' element={<Home />}></Route>
    <Route path="/checkout" element={<CheckoutForm />} />
    <Route path="/return" element={<Return />} />
    <Route path='/dashboard' element={<Dash />}/>
    </Routes>
    </BrowserRouter>
    
    </>
    

  );
}

export default App;
export{};
