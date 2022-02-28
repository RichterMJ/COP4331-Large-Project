import React, { useState } from 'react';

function Signup() {

  let name;
  let email;
  let password;
  let repeat;

  const [message, setMessage] = useState('');

  const doSignup = async (event) => {
    event.preventDefault();

    if(repeat != password){
      setMessage('Passwords do not match');
      return;
    }

    const obj = {name:name.value, email:email.value, password: password, repeat: repeat};
    const js = JSON.stringify(obj);

    try
    {    
        const response = await fetch('http://localhost:5000/api/signup',
            {method:'POST', body:js ,headers:{'Content-Type': 
            'application/json'}});
        var res = JSON.parse(await response.text());
        if( res.id <= 0 )
        {
            setMessage('Duplicate username');
        }
        else
        {
            var user = {firstName:res.firstName,lastName:res.lastName,id:res.id};
            localStorage.setItem('user_data', JSON.stringify(user));
            setMessage('');
            window.location.href = '/cards';
        }
    }
    catch(e)
    {
        console.log(e.toString());
        return;
    }    
  };

  return (
    <div className="container">
      <h2 className="text-center"> Sign Up </h2>
      <form>
        <div>
          <label className="form-label" for="signupName">
            Name
          </label>
          <input
            type="text"
            id="signupName"
            className="form-control form-control-lg"
          />
        </div>

        <div>
          <label className="form-label" for="signupEmail">
            Email
          </label>
          <input
            type="email"
            id="signupEmail"
            className="form-control form-control-lg"
          />
        </div>

        <div>
        < label className="form-label" for="signupPassword">
            Password
          </label>
          <input
            type="password"
            id="signupPassword"
            className="form-control form-control-lg"
          />
        </div>

        <div>
          <label className="form-label" for="confirmPassword">
            Repeat your password
          </label>
          <input
            type="password"
            id="confirmedPassword"
            className="form-control form-control-lg"
          />
        </div>

        <div>
          <button
            type="button"
            className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
            onSubmit={doSignup}
          >
            Register
          </button>
        </div>
        <br></br>
        <p className="text-center text-muted mt-5 mb-0">
          Have already an account?{" "}
          <a href="/" class="fw-bold text-body">
            <u>Login here</u>
          </a>
        </p>
      </form>
    </div>
  );
}
export default Signup;
