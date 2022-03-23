import e from "cors";
import React, { useState } from "react";
import buildPath from "./path";
import { makeLink } from "./divHelpers/divHelpers";

function Login() {
  const [errorMessage, setMessage] = useState("");

  // funtion return 1 if input is blank
  // return 0 if not blank
  function blankValidator(...fields) {
    let isBlanked = false;
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].value == "") {
        fields[i].classList.add("is-invalid");
        isBlanked = true;
      } else {
        fields[i].classList.remove("is-invalid");
      }
    }

    return isBlanked;
  }
  const doLogin = async (event) => {
    let email = document.getElementById("email");
    let password = document.getElementById("password");

    if (blankValidator(email, password)) {
      return;
    }

    const loginData = {
      email: email.value,
      password: password.value,
    };

    const loginJSON = JSON.stringify(loginData);

    try {
      const response = await fetch(buildPath("api/users/login"), {
        method: "POST",
        body: loginJSON,
        headers: { "Content-Type": "application/json" },
      });

      let res = JSON.parse(await response.text());

      console.log(res);

      if (res.error == 3) {
        setMessage("Incorrect email/password");
      } else {
        const user = {
          firstName: res.firstName,
          lastName: res.lastName,
          id: res.userId,
        };
        localStorage.setItem("user_data", JSON.stringify(user));
        setMessage("");
        //window.location.href = "/userpage";
      }
    } catch (e) {
      console.log(e.toString());
      return;
    }
  };

  function makeInput(type, id, name, placeholder) {
    return (
      <div className="has-validation">
        <input
          className="form-control"
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
        />
        <div className="invalid-feedback">{id} cannot be blank</div>
      </div>
    );
  }
  function makeErrorMessage(className, error) {
    return <p className={className}>{error}</p>;
  }
  function makeActionButton(type, className, event, text, id = "") {
    return (
      <button type={type} className={className} onClick={event} id={id}>
        {text}
      </button>
    );
  }

  function makeLinkDiv(className, href, content) {
    return (
      <a className={className} href={href}>
        {content}
      </a>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          <h2 className="text-center">Log in</h2>
          {makeInput("email", "email", "login", "email")}
          <br></br>
          {makeInput("password", "password", "login", "password")}
          <div>
            {makeActionButton(
              "button",
              "btn btn-block",
              () => doLogin(),
              "Login",
              "loginButton"
            )}
          </div>
          {errorMessage != "" && makeErrorMessage("text-danger", errorMessage)}
          <div id="formFooter">
            {makeLinkDiv(
              "underLineHover",
              "forgot-password",
              "Forgot Password?"
            )}
            <br></br>
            {makeLinkDiv("underLineHover", "signup", "Create an Account")}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
