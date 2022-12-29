import React from 'react'
import '../../css/header.css';
const Header = (props) => {
  return (
    <nav className="navbar navbar-expand-sm ">

  <a className="navbar-brand" href="#">Kart</a>

  
  <ul className="navbar-nav">

    {/* <li className="nav-item">
      <a className="nav-link" href="#">Link 2</a>
    </li> */}

    <li className="nav-item">
      <a className="nav-link" href="/products/mobiles/all-mobiles">Mobiles</a>
    </li>
   
    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown">
        Electronics
      </a>
      <div className="dropdown-menu">
        <a className="dropdown-item" href="/products/mobiles/all-mobiles">All Mobiles</a>
        <a className="dropdown-item" href="/products/smart-watches">Smart Watches</a>
        <a className="dropdown-item" href="#">HeadPhones</a>
        <a className="dropdown-item" href="#">Speakers</a>
      </div>
    </li>

   


  </ul>

    <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
        <ul className="navbar-nav ml-auto dpdmn_list_ml_102">
        <li className="nav-item dropdown ">
            <a className="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown">
              ...
            </a>
            <div className="dropdown-menu">
              <a className="dropdown-item" href="#">Profile</a>
              <a className="dropdown-item" href="/logout">Logout</a>
            </div>
        </li>
        </ul>
    </div>
</nav>

  )
}

export default Header
