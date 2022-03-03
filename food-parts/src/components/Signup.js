import React, { useState } from "react";

function Signup() {
  let fName;
  let lName;
  let weight;
  let email;
  let password;
  let repeat;

  const [message, setMessage] = useState("");

  const doSignup = async (event) => {
    console.log("test");
    event.preventDefault();

    if (repeat != password) {
      setMessage("Passwords do not match");
      return;
    }

    const obj = {
      fName: fName.value,
      lName: lName.value,
      weight: weight.value,
      email: email.value,
      password: password,
      repeat: repeat,
    };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });
      var res = JSON.parse(await response.text());
      if (res.id <= 0) {
        setMessage("Duplicate username");
      } else {
        var user = {
          firstName: res.firstName,
          lastName: res.lastName,
          id: res.id,
        };
        localStorage.setItem("user_data", JSON.stringify(user));
        setMessage("");
        window.location.href = "/cards";
      }
    } catch (e) {
      console.log(e.toString());
      return;
    }
  };

  function makeLabel(title, txt, marginLeft = 0) {
    return (
      <label
        style={{ display: "block", marginLeft: marginLeft }}
        className="form-label"
        htmlFor={title}
      >
        {txt}
      </label>
    );
  }

  function makeInput(
    type,
    id,
    { ...style } = "",
    className = "form-control form-control-lg"
  ) {
    return <input type={type} id={id} className={className} style={style} />;
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

  return (
    <div className="container">
      <div className="card">
        <h2 className="text-center"> Sign Up </h2>

        <div className="ourRow">
          <div className="fNameBox">
            {makeLabel("signupFName", "First Name")}
            {makeInput("text", "signupFName", { width: 400 })}
          </div>

          <div className="lNameBox">
            {makeLabel("signupLName", "Last Name", 50)}
            {makeInput("text", "signupLName", { width: 400, marginLeft: 50 })}
          </div>

          <div>
            {makeLabel("signupWeight", "Weight", 50)}
            {makeInput("text", "signupWeight", { width: 85, marginLeft: 50 })}
          </div>
        </div>

        <div class="longBox">
          {makeLabel("signupEmail", "Email")}
          {makeInput("email", "signupEmail")}
        </div>

        <div class="longBox">
          {makeLabel("signupPassword", "Password")}
          {makeInput("password", "signupPassword")}
        </div>

        <div class="longBox">
          {makeLabel("confirmPassword", "Repeat your password")}
          {makeInput("password", "confirmedPassword")}
        </div>

        <div class="signupButton">
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
