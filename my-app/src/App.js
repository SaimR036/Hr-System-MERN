import 'bootstrap/dist/css/bootstrap.min.css';
import Feed from './feed';
import { fetchUsers,fetchPosts,fetchFriends } from './controllers/UsersC';
import { useEffect, useState } from 'react';
import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
 import Dash from './Dash'
 import Home from './Home'
 import Search from './searched'
import Navi from './nav'
import Payment from './payment'
import CheckoutForm from './checkout'
import Return from './Return'
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
