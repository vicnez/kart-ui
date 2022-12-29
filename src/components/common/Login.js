import React, { useState } from 'react';
import axios from 'axios';
import '../../css/login.css';
import {setUserSession} from '../../utils/Common';
import { useNavigate } from 'react-router-dom';
const Login = () => {

	let navigate = useNavigate();
    const [loginmsg, setLoginMsg] = useState([]);
	const [loading, setLoading] = useState(false);
	const [alertdisplaylogin, setAlertDisplayLogin] = useState(false);

	let loginUser = (e) => {
    	e.preventDefault();
    	console.log("login");
    	setLoading(true);
    	let username = e.target.elements.username.value;
    	let password = e.target.elements.password.value;
    	axios.post("http://localhost:8001/api/user/login",{
    		username:username,
    		password:password
    	}).then(login_response =>{
			console.log(login_response.data.error);

    		if(login_response.data.error){

    			console.log(login_response.data.error.message);
    			setLoginMsg(login_response.data.error.message);
    			setAlertDisplayLogin(true);
    			setLoading(false);
    		}else{
    			console.log("Login Success")
    			console.log(login_response); //return false;
    			setAlertDisplayLogin(false);
    			setLoading(false);
    			document.getElementById("loginForm").reset();
    			setUserSession(login_response.data.result.result.token, login_response.data.result.result);
      			navigate('/');
				      			
    		}
    		
    	})
    	.catch(error => {
    		setLoading(false);
    		console.log(error);
    	});
    	
	}
  
  return (
    <div className="container" style={{overflow: "hidden"}}>
			<div className="container-fluid h-100">
			    <div className="row justify-content-center align-items-center h-100" style={{marginTop: "225px" }}>
			        <div className="col col-sm-6 col-md-6 col-lg-6 col-xl-6 ">
			        <div className="alert alert-warning alert-dismissible " style={{ display: alertdisplaylogin ? "block" : "none" }}>
								  <button type="button" className="close" data-dismiss="alert">&times;</button>{loginmsg} </div>
                     <center><div className="mb-5"> {/*<img src="#" alt="logo" />*/} <span><strong>Kart</strong></span></div></center>
			            <form id="loginForm" onSubmit={loginUser}>

			                <div className="form-group">
			                    <input className="form-control form-control-lg" placeholder="Email / Phone" type="text" name="username" id="username" required/>
			                </div>
			                <div className="form-group">
			                    <input className="form-control form-control-lg" pattern=".{4,}" placeholder="Password" type="password" name="password" id="password" required/>
			                </div>
			                <div className="form-group">
			                    <button type="submit" className="btn btn-info btn-lg btn-block" >{loading ? 'Authenticating...' : 'Login'}</button>
			                </div>
			            </form>
                        <center>
                        <div className="signup"><p>Don't have an account ? <a href="/signup"> Sign Up</a></p></div>
                        <div className="forgot_password"> <a href="/"> Forgot your password?</a></div></center>
			        </div>

			    </div>
		    </div>
	    </div>
  )
}

export default Login
