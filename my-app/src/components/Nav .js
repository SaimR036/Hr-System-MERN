import React from 'react';
import '../CSS/Nav.css';
import homeicon from '../assets/home.png'
import noticon from '../assets/bell.png'
import neticon from '../assets/social-media.png'
import msgicon from '../assets/email.png'
import jobicon from '../assets/suitcase.png'

export default function Nav() {
  return (
    <div className='cont'>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-11">
            <nav class="navbar navbar-expand-sm custom-navbar">
              <a class="navbar-brand logo" href="#">Logo</a>
              <form class="form-inline ml-auto ">
                <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
              </form>

              <ul class="navbar-nav">
                <li class="nav-item">

                  <a class="nav-link" href="#"> <img src={homeicon} class="nav-logo" alt='homeicon' />Home</a>
                </li>
                <li class="nav-item">

                  <a class="nav-link" href="#">
                    <img src={neticon} class="nav-logo" alt='homeicon' />

                    My Network
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">
                    <img src={jobicon} class="nav-logo" alt='homeicon' />Jobs</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">
                    <img src={msgicon} class="nav-logo" alt='homeicon' />
                    Messages</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">
                    <img src={noticon} class="nav-logo" alt='homeicon' />Notifications</a>
                </li>

                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown">

                    Me
                  </a>
                  <div className="dropdown-menu">
                    <a className="dropdown-item" href="#">Action</a>
                    <a className="dropdown-item" href="#">Another action</a>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" href="#">Separated link</a>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" href="#">Separated link</a>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
