import React, { useState, useEffect } from 'react';
import { getUser, removeUserSession } from '../../utils/Common';
import { useNavigate  } from 'react-router-dom';
const Logout = (props) => {
    let navigate = useNavigate();
    

    useEffect(() => {
        handleLogout();
    });

    const user = getUser();

    // handle event of logout option it will automatically triggered when the Logout component is Mounted
    const handleLogout = () => {
  	    console.log(user);
        removeUserSession();
        navigate("/login");
    }


   

    return (
        <p></p>
    );
}

export default Logout
