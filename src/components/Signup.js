import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
  const navigate = useNavigate();


  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = credentials;
    const response = await fetch('http://localhost:5000/api/auth/createuser', {
      method: "Post",
      headers: {
        "Content-Type": "application/json"

      },
      body: JSON.stringify({ name, email, password })

    });

    const json = await response.json();


    if(json.success){

      localStorage.setItem('token',json.authToken);
      navigate('/');
      props.showAlert("Account created successfully","success");
  }
  else{
    props.showAlert("Invalid credentials","danger");

  }

}


  





  return (
    <div className='container mt-2'>
       <h2>Create an Account to use Notebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" name="name" onChange={onChange} className="form-control" id="name" aria-describedby="emailHelp" />

        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" name="email" onChange={onChange} className="form-control" id="email" aria-describedby="emailHelp" />

        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" name='password' onChange={onChange} className="form-control" id="password"
           minLength={5} required />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input minLength={5} required type="password" name='cpassword' onChange={onChange} className="form-control" id="cpassword" />
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default Signup
