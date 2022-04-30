import React, { useState, useEffect, useRef} from "react";
import buildPath from "./path";
import { makePTag, makeInputDiv, makeActionButton, makeDiv, makeButton, makeLink, makeSpan, makeH2 } from "./divHelpers/divHelpers";
import { emailValidator, passwordValidator, addInvalidStyle, makeErrorMessage} from "./Validators/InputValidator";
import {JSONRequest} from "./RESTHelpers/JSONRequest"

let storage = require('./tokenStorage.js');
const MD5 = require('md5');


function Login() {

  // Here are the various states for the login

  const [errorMessage, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState({
    emailError: "",
    passwordError: ""
  });
  
  // this function validate and set the fromError 
  // return true if Login inputs are valid, false otherwise.
  function isValidLoginInputs(email, password){
    let errors ={};
    errors.emailError= emailValidator(email);
    errors.passwordError = passwordValidator(password, false); // second argument is whether we need to validate format
    setFormError(errors);
    return (errors.emailError == "" && errors.passwordError =="");
  }

  function makeLoginJSON(email,password){
    const loginData = {
      email: email,
      password: MD5(password),
    };
    return JSON.stringify(loginData);
  }
  // useEffect(() =>{
  //   console.log(isFirstSubmit)
  //   if (!isFirstSubmit){
  //     return;
  //   }
  //   setFormError(validate(email, password));
    
  // }, [email, password, isFirstSubmit])


  function handleLoginRes(res){
    if (res.error == 3) {
      setMessage("Incorrect email/password");

    } else if(res.error == 0){
      storage.storeToken(res) // store the token into localStorage
      const user = {
        firstName: res.firstname,
        lastName: res.lastname,
        userId: res.userId,
        weight: res.weight,
        email: res.email
      };
      localStorage.setItem("user_data", JSON.stringify(user));
      setMessage("");
      window.location.href = "/#/userPage";
    }
  }
  const doLogin = async (event) => {

    if (!isValidLoginInputs(email, password)){
      return; // if there is invalid inputs, abort
    }
   
    const loginJSON = makeLoginJSON(email,password);
  
      const res = await JSONRequest("POST", loginJSON,"api/users/login");
      console.log(res);
    
      handleLoginRes(res);
  };

  
  function LoginForm(){
    return (
      <div className="d-flex flex-column ">
            {makeInputDiv("email", "loginEmailInput",`mt-2 form-control ${addInvalidStyle(formError.emailError)}`,email,"email", "email",setEmail)}
            {makeErrorMessage(formError.emailError)}
            {makeInputDiv("password", "loginPasswordInput",`mt-2 form-control ${addInvalidStyle(formError.passwordError)}`, password,"password", "password",setPassword)}
            {makeErrorMessage(formError.passwordError)}
            {makeActionButton(
              "button",
              "btn btn-block",
              () => doLogin(),
              "Login",
              "loginButton"
            )}
            {makeErrorMessage(errorMessage)}
      </div>
    );
  }
  function FormFooter(){
    return(
    <div id="formFooter">
      {makeLink(
          "#/forgotPassword",
          "underLineHover d-block",
          "Forgot Password?"
      )}

      {makeLink("#/signup", "underLineHover d-block", "Create an Account")}

    </div>
    )

  }
  return (
    <div className="container" data-testid="login-container"> {/*data-testid is for unit test*/}
      <div className="card card-body">
          <h2 className="text-center">Log in</h2>

        {LoginForm()}
          {/* <LoginForm email = {setEmail} password ={setPassword}/> */}
          {FormFooter()}
        {/* <Link/> */}

      </div>
    </div>
  );
}
export default Login;
