import React, { useState } from "react";
import buildPath from "./path";
import { makePTag, makeInputDiv, makeActionButton, makeDiv, makeButton, makeLink, makeSpan, makeH2 } from "./divHelpers/divHelpers";
import { blankValidator} from "./Validators/InputValidator";
import postJSON from "./RESTHelpers/PostHelpers"


function Login() {
  // Here are the various states for the login
  const [errorMessage, setMessage] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");


  function makeLoginJSON(email,password){
    const loginData = {
      email: email.value,
      password: password.value,
    };
    return JSON.stringify(loginData);
  }


  function handleLoginRes(res){
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
  }
  const doLogin = async (event) => {
    if (blankValidator(email, password)) {
      return;
    }
    const loginJSON = makeLoginJSON(email,password);
    let res = postJSON(loginJSON,"api/users/login");
    handleLoginRes(res);
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
  function FormFooter(){
    return(
    <div id="formFooter">
      {makeLink(
          "forgotPassword",
          "underLineHover d-block",
          "Forgot Password?"
      )}

      {makeLink("signup", "underLineHover d-block", "Create an Account")}

    </div>
    )

  }


  return (
    <div className="container">
      <div className="card card-body">
          <h2 className="text-center">Log in</h2>
          <LoginForm email = {setEmail} password ={setPassword}/>
          <FormFooter/>
        <Link/>
      </div>
    </div>
  );
}
export default Login;
