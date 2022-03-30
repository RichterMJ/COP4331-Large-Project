import React, { useState } from "react";
import buildPath from "./path";
import { makePTag, makeInputDiv, makeActionButton, makeDiv, makeButton, makeLink, makeSpan, makeH2 } from "./divHelpers/divHelpers";
import { blankValidator} from "./Validators/InputValidator";


function Login() {
  // Here are the various states for the login
  const [errorMessage, setMessage] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");


  
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

      // console.log(res); print out api response too see the data

      if (res.error == 3) {
        setMessage("Incorrect email/password");
      } else {
        const user = {
          firstName: res.firstname,
          lastName: res.lastname,
          userId : res.userId
        };
        localStorage.setItem("user_data", JSON.stringify(user));
        setMessage("");
        window.location.href = "/userpage";
      }
    } catch (e) {
      console.log(e.toString());
      return;
    }
  };

  
  function LoginForm(props){
    return (
      <div className="d-flex flex-column">
            
            {makeInputDiv("email", "email","pt-2","","email", "email",setEmail)}
            
            {makeInputDiv("password", "password","", "pt-2","password", "password",setPassword)}

            {makeActionButton(
              "button",
              "btn btn-block",
              () => doLogin(),
              "Login",
              "loginButton"
            )}
            {errorMessage != "" && makePTag("text-danger", errorMessage)}
      </div>
    );
  }


  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          
          {makeH2("", "text-center", "Log in")}

          <LoginForm email = {setEmail} password ={setPassword}/>

          <div id="formFooter">
            {makeLink(
              "forgotPassword",
              "underLineHover d-block",
              "Forgot Password?"
            )}

            {makeLink("signup", "underLineHover d-block", "Create an Account")}
            
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
