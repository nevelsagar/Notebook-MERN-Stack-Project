import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({ email: "", password: "" });



    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: "Post",
            headers: {
                "Content-Type": "application/json"

            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })

        });

        const json = await response.json();
        if (json.success) {

            localStorage.setItem('token', json.authToken);
            props.showAlert("Logged in successfully", "success");
            navigate('/');

        }
        else {
            props.showAlert("Invalid credentials", "danger")

        }


    }

    return (
        <div className='mt-3'>
            <h2>Login to Continue to Notebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input value={credentials.email} type="email" name="email" className="form-control" id="email" aria-describedby="emailHelp" onChange={onChange} />

                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input value={credentials.password} type="password" name="password" className="form-control" id="password"
                        onChange={onChange} />
                </div>

                <button type="submit" className="btn btn-primary" >Submit</button>
            </form>
        </div>
    )
}

export default Login
