import React, { useState } from "react";

function Signup() {
  const [errorMessage, setMessage] = useState("");

  const doSignup = async (event) => {
    //event.preventDefault();

    let fName = document.getElementById('fName');
    let lName = document.getElementById('lName');
    let weight = document.getElementById('weight');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let repeat = document.getElementById('repeat');

    if (repeat.value != password.value) {
      setMessage("Passwords do not match");
      return;
    }

    const obj = {
      firstName: fName.value,
      lastName: lName.value,
      weight: weight.value,
      email: email.value,
      password: password.value,
    };

    const js = JSON.stringify(obj);

    //console.log(js);
    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });
      
      let res = JSON.parse(await response.text());

      console.log(res);

      if (res.id <= 0) {
        setMessage("Duplicate username");
      } else {
        const user = {
          firstName: res.firstName,
          lastName: res.lastName,
          id: res.id,
        };
        localStorage.setItem("user_data", JSON.stringify(user));
        setMessage("");
        //window.location.href = "/";
      }
    } catch (e) {
      console.log(e.toString());
      return;
    }
  };

  function makeLabel(title, txt, className = "") {
    return (
      <label
        className={className + " signupLabel form-label"}
        htmlFor={title}
      >
        {txt}
      </label>
    );
  }

  function makeInput(
    type,
    id,
    className = "",
  ) {
    return <input type={type} id={id} className={className + " form-control form-control-lg"}/>;
  }

  function makeButton(className, onClick, txt) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {txt}
      </button>
    );
  }

  function makeLink(href, className, txt) {
    return (
      <a href={href} class={className}>
        <u>{txt}</u>
      </a>
    );
  }

  function makeSpan(className, txt){
    return (<span className={className}>{txt}</span>);
  }

  return (
    <div className="container">
      
      <div className="card">
      
        <h2 className="text-center"> Sign Up </h2>

        <div className="firstRow">
          <div className="fNameBox">
            {makeLabel("signupFName", "First Name")}
            {makeInput("text", "fName", "fNameInput")}
          </div>

          <div className="lNameBox">
            {makeLabel("signupLName", "Last Name", "lNameLabel")}
            {makeInput("text", "lName", "lNameInput")}
          </div>

          <div className="weightBox">
            {makeLabel("signupWeight", "Weight", "weightLabel")}
            <div className="input-group">
              {makeInput("text", "weight", "weightInput")}
              <div className="input-group-append">
                {makeSpan("input-group-text", "lbs")}
              </div>
            </div>
          </div>
        </div>

        <div className="longBox">
          {makeLabel("signupEmail", "Email")}
          {makeInput("email", "email")}
        </div>

        <div className="longBox">
          {makeLabel("signupPassword", "Password")}
          {makeInput("password", "password")}
        </div>

        <div className="longBox">
          {makeLabel("confirmPassword", "Repeat your password")}
          {makeInput("password", "repeat")}
        </div>

        <div className="signupButton">
          {makeButton(
            "btn btn-success btn-block btn-lg gradient-custom-4 text-body",
            () => doSignup(),
            "Register"
          )}
        </div>

        <p className="text-center text-muted mt-5 mb-0">
          Have an account already?{" "}
          {makeLink("/", "fw-bold text-body", "Login here")}
        </p>
      </div>
    </div>
  );
}
export default Signup;
