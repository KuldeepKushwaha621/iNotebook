import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom';

const Login = (props) => {
  
 const [credential, setcredential] = useState({email : "", password : ""})
 let history = useNavigate();

const handlesubmit =async (e)=>{
      e.preventDefault();  //to prevent loading the page
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email : credential.email, password :credential.password}), 
      });
      const json = await response.json();
      console.log(json);
      if (json.success){
        //save auth token and redirect
        localStorage.setItem('token', json.authtoken);
        history('/')
        props.showAlert("Logged in successfully", 'success')
      }
      else{
        props.showAlert("Invalid credential", 'danger')
      }
}
const onChange=(e)=>{
    setcredential({...credential, [e.target.name]:e.target.value })
}


  return (
    <div>
<form onSubmit={handlesubmit}>
    <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" value={credential.email} onChange={onChange} id="email" name='email' aria-describedby="emailHelp" />
    </div>
    <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control" value={credential.password} onChange={onChange} id="password" name = 'password'/>
    </div>
    <button type="submit" className="btn btn-primary" >Submit</button>
</form>
    </div>
  )
}

export default Login
