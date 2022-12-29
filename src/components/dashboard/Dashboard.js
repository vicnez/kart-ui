import React, {useState, useEffect} from 'react';
import Header from '../common/Header';
import {getToken} from '../../utils/Common';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const user_token = getToken();
    console.log(user_token);
    if(user_token === null){
        navigate("/login"); 
        console.log("************1");
    }
  });
  
  
  return (
    <div className="App">
    <Header />

    <div className="sidebar">
    <div className='container' >
      </div>
      </div>
      </div>
  
  )
}

export default Dashboard
