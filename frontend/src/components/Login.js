import React, { useState } from "react";
import buildPath from "./path";

function Login() {
  const [errorMessage, setMessage] = useState("");

  function checkBlackInput(htmlId) {
    if (document.getElementById(htmlId).value == "") {
      document.getElementById(htmlId).classList.add("is-invalid");
      return 1;
    }

    return 0;
  }
  const doLogin = async (event) => {
    let email = document.getElementById("email");
    let password = document.getElementById("password");

    if (checkBlackInput("email")) {
      console.log("email empty");
      return;
    }
    if (checkBlackInput("password")) {
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
        <div className="invalid-feedback">{name} cannot be blank</div>
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
            {makeLinkDiv("underLineHover", "s", "Forgot Password?")}
            <br></br>
            {makeLinkDiv("underLineHover", "signup", "Create an Account")}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
