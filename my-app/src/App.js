import 'bootstrap/dist/css/bootstrap.min.css';
import Feed from './components/feed';
import { fetchUsers,fetchPosts,fetchFriends } from './controllers/UsersC';
import { useEffect, useState } from 'react';
import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
 import Dash from './components/Dash'
 import Home from './components/Home'
 import Search from './components/searched'
 import Signup from './components/Signup'
 import Login from './components/login'
import Navi from './components/nav'
import MyNetwork from './components/myNetwork'
import Payment from './components/payment'
import CheckoutForm from './components/checkout'
import Jobs from './components/jobs'
import Return from './components/Return'
import Chat from './components/Chat'
export function App() {
 
  return (
    <>
    
    <BrowserRouter>
    <Routes>
    
    <Route path='/search' element={<Search/>}></Route>
    <Route path='/Home' element={<Home />}></Route>
    <Route path="/checkout" element={<CheckoutForm />} />
    <Route path="/return" element={<Return />} />
    <Route path='/dashboard' element={<Dash />}/>
    <Route path='/Signup' element={<Signup />}></Route>
    <Route path='/' element={<Login />}></Route>
    <Route path = '/jobs' element={<Jobs />}></Route>
    <Route path='/myNetwork' element = {<MyNetwork />}></Route>
    <Route path='/chat' element={<Chat />}></Route>
    </Routes>
    </BrowserRouter>
    
    </>
    

  );
}

export default App;
export{};
