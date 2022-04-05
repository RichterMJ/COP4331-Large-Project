import React, { useState } from "react";
import buildPath from "./path";
import { makePTag, makeInputDiv, makeActionButton, makeDiv, makeButton, makeLink, makeSpan, makeH2 } from "./divHelpers/divHelpers";
import { blankValidator} from "./Validators/InputValidator";
import postJSON from "./RESTHelpers/PostHelpers"
let storage = require('./tokenStorage.js');


function Login() {
  // Here are the various states for the login
  const [errorMessage, setMessage] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  

  function makeLoginJSON(email,password){
    const loginData = {
      email: email,
      password: password,
    };
    return JSON.stringify(loginData);
  }


  function handleLoginRes(res){
    if (res.error == 3) {
      setMessage("Incorrect email/password");
    } else {

      storage.storeToken(res); // store the token into localStorage
      const user = {
        firstName: res.firstname,
        lastName: res.lastname,
        userId : res.userId
      };
      console.log('token ', storage.retrieveToken());
      localStorage.setItem("user_data", JSON.stringify(user));
      setMessage("");
      window.location.href = "/userpage";
    }
  }
  const doLogin = async (event) => {
    
    // if (blankValidator(email, password)) {
    //   return;
    // }
    const loginJSON = makeLoginJSON(email,password);
    let res = await postJSON(loginJSON,"api/users/login");
    console.log(res);
    handleLoginRes(res);
  };

  
  function LoginForm(props){
    return (
      
      <div className="d-flex flex-column ">
            {makeInputDiv("email", "loginEmailInput","pt-2","","email", "email",setEmail)}
            
            {makeInputDiv("password", "loginPasswordInput","pt-2", "","password", "password",setPassword)}

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

          {LoginForm()}
          {/* <LoginForm email = {setEmail} password ={setPassword}/> */}
          {FormFooter()}
        {/* <Link/> */}

      </div>
    </div>
  );
}
export default Login;
