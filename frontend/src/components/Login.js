import e from "cors";
import React, { useState } from "react";
import buildPath from "./path";
import { makePTag, makeActionButton, makeDiv, makeButton, makeLink, makeSpan, makeH2 } from "./divHelpers/divHelpers";
import { blankValidator} from "./Validators/InputValidator";


function Login() {
  const [errorMessage, setMessage] = useState("");

  
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
        <div className="invalid-feedback">{name} cannot be blank</div>
      </div>
    );
  }
  


  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          <h2 className="text-center">Log in</h2>
          <div className="d-flex flex-column">
          {makeInput("email", "email", "email", "email")}
          
          {makeInput("password", "password", "password", "password")}

            {makeActionButton(
              "button",
              "btn btn-block",
              () => doLogin(),
              "Login",
              "loginButton"
            )}
          {errorMessage != "" && makePTag("text-danger", errorMessage)}
          </div>
          <div id="formFooter">
            {makeLink(
              "forgotPassword",
              "underLineHover",
              "Forgot Password?"
            )}
            <br></br>
            <div className="underLineHover">
            {makeLink("signup", "", "Create an Account")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
