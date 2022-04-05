import React, { useState, useEffect, useRef} from "react";
import buildPath from "./path";
import { makePTag, makeInputDiv, makeActionButton, makeDiv, makeButton, makeLink, makeSpan, makeH2 } from "./divHelpers/divHelpers";
import { emailValidator, passwordValidator, addInvalidStyle, makeErrorMessage} from "./Validators/InputValidator";
import postJSON from "./RESTHelpers/PostHelpers"
import e from "cors";


function Login() {
  // Here are the various states for the login
  const [errorMessage, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState({});
  const [disabled, setDisabled] = useState(false);
  const firstRender = useRef();
  
  let storage = require('./tokenStorage.js');
  
  function validate(email, password){
    const errors ={};
    errors.email= emailValidator(email);
    errors.password = passwordValidator(password, false); // second argument is whether we need to validate format
  
    return errors;
  }

  function makeLoginJSON(email,password){
    const loginData = {
      email: email,
      password: password,
    };
    return JSON.stringify(loginData);
  }
  useEffect(() =>{
  
    if (Object.keys(formError).length == 0){
      
    }
  }, [formError])


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
      localStorage.setItem("user_data", JSON.stringify(user));
      setMessage("");
      window.location.href = "/userpage";
    }
  }
  const doLogin = async (event) => {
    
    // console.log("hello1");
    // const errors = validate(email, password);
    // setFormError(errors); // validate form
    // console.log(formError);
    
    // if (formError.email != "" ||formError.password != "" ||formError.confirmPassword != ""){
    //   console.log("helllo3")
    //   return // programs stops if there is error
    // }
    if (disabled){
      return;
    }
    const loginJSON = makeLoginJSON(email,password);
  
    let res = await postJSON(loginJSON,"api/users/login");
    console.log(res);
    
    handleLoginRes(res);
  };

  
  function LoginForm(props){
    return (
      <div className="d-flex flex-column ">
            {makeInputDiv("email", "loginEmailInput",`mt-2 form-control ${addInvalidStyle(formError.email)}`,"","email", "email",setEmail)}
            {makeErrorMessage(formError.email)}
            {makeInputDiv("password", "loginPasswordInput",`mt-2 form-control ${addInvalidStyle(formError.password)}`, "","password", "password",setPassword)}
            {makeErrorMessage(formError.password)}
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
          "forgotPassword",
          "underLineHover d-block",
          "Forgot Password?"
      )}

      {makeLink("signup", "underLineHover d-block", "Create an Account")}

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
