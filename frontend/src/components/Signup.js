import React, { useState } from "react";
import VerifyModal from "./Modals/VerifyModal";
import {makeButton, makeLink, makeSpan} from "./divHelpers/divHelpers";
import {isBlank, validWeight, validEmail, validPassword, matchingPasswords} from "./Validators/SignupValidators";
import {makeErrorMessage} from "./Validators/InputValidator";
import {JSONRequest} from "./RESTHelpers/JSONRequest";

const MD5 = require('md5');

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [weight, setWeight] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [errorMessage, setMessage] = useState(""); 

  const [formClassError, setFormClassError] = useState({
    fnErrorClass: "",
    lnErrorClass: "",
    weightErrorClass: "",
    emailErrorClass: "",
    pwErrorClass: "",
    repeatErrorClass: ""
  })

  const [formError, setFormError] = useState({
    fnError: "",
    lnError: "",
    weightError: "",
    emailError: "",
    pwError: "",
    repeatError: ""
  });

  const [isOpen, setIsOpen] = useState(false);

  function makeSignupJSON(){
    const signupData = {
      firstname: firstName,
      lastname: lastName,
      weight: Number(weight),
      email: email,
      password: MD5(password)
    }

    return JSON.stringify(signupData);
  }

  function makeEmailJSON(res){
    const sendEmailData = {
      userId: res.userId,
      email: email
    }

    return JSON.stringify(sendEmailData);
  }

  function makeFormErrorJSON(){
    return {
      fnError: formError.fnError,
      lnError: formError.lnError,
      weightError: formError.weightError,
      emailError: formError.emailError,
      pwError: formError.pwError,
      repeatError: formError.repeatError
    };
  }

  function makeFormClassErrorJSON(){
    return {
      fnErrorClass: formClassError.fnErrorClass,
      lnErrorClass: formClassError.lnErrorClass,
      weightErrorClass: formClassError.weightErrorClass,
      emailErrorClass: formClassError.emailErrorClass,
      pwErrorClass: formClassError.pwErrorClass,
      repeatErrorClass: formClassError.repeatErrorClass
    };
  }

  async function handleSignupRes(res){
      if (res.error == 0) {
        const emailJSON = makeEmailJSON(res);

        try{
          //For when this method is complete
          let emailRes = await JSONRequest("POST", emailJSON, "api/users/emailVerification/sendVerificationEmail");
          handleSendEmailResponse(emailRes);
        }catch(e){
          console.log(e);
        }
      } else if (res.error ==3){
        // existing user detected
        setMessage(`${email} is already associated with a different account`);
      } else {
        setMessage("Error occured")
      }
  }

  function handleSendEmailResponse(sendEmailRes){
      if(sendEmailRes.error == 0)
        setIsOpen(true);
      else
        console.log(sendEmailRes.error);
  }

  function fieldsArray(){
    return new Array(firstName, lastName, weight, email, password, passwordRepeat);
  }

  function hasError(){
    let textErrors = makeFormErrorJSON();
    let classErrors = makeFormClassErrorJSON();

    //Single | makes it so it reaches all functions even if one would typically return set of statements

    return    isBlank(fieldsArray(), classErrors, setFormClassError, textErrors, setFormError)
            | !matchingPasswords(password, passwordRepeat, classErrors, setFormClassError, textErrors, setFormError)
            | !validWeight(weight, classErrors, setFormClassError, textErrors, setFormError) 
            | !validEmail(email, classErrors, setFormClassError, textErrors, setFormError) 
            | !validPassword(password, classErrors, setFormClassError, textErrors, setFormError);
  }

  const doSignup = async (event) => {

    if(hasError())
      return;

    const signupJSON = makeSignupJSON();

    try{
        let res = await JSONRequest("POST", signupJSON, "api/users/register");
        console.log(res);
        handleSignupRes(res);
    }catch(e){
      console.log(e);
    }
  };

  function makeLabel(title, txt, className = "") {
    return (
      <label className={className + " signupLabel form-label"} htmlFor={title}>
        {txt}
      </label>
    );
  }

  function makeInput(type, id, className = "", onChange) {
    return (
      <input
        type={type}
        autoFocus="autoFocus"
        id={id}
        className={className + " form-control form-control-lg"}
        onChange={onChange}
      />
    )
  }


  function FirstName(){
    return (
            <div className="fNameBox">
                {makeLabel("signupFName", "First Name")}
                {makeInput("text", "fName", " " + formClassError.fnErrorClass, (txt) => setFirstName(txt.target.value))}
                {makeErrorMessage(formError.fnError)}
            </div>
            )
  }

  function LastName(){
    return (
            <div className="lNameBox">
              {makeLabel("signupLName", "Last Name", "lNameLabel")}
              {makeInput("text", "lName", "lNameInput " + formClassError.lnErrorClass, (txt) => setLastName(txt.target.value))}
              <div className = "lnError">
                {makeErrorMessage(formError.lnError)}
              </div>
            </div>
          )
  }

  function Weight(){
    return (
            <div className="weightBox">
                {makeLabel("signupWeight", "Weight", "weightLabel")}
                <div className="input-group">
                  {makeInput("text", "weight", "weightInput " + formClassError.weightErrorClass, (txt) => setWeight(txt.target.value))}
                  <div className="input-group-append">
                    {makeSpan("input-group-text", "lbs")}
                  </div>
                  {makeErrorMessage(formError.weightError)}
                </div>
            </div>
          )
  }

  function Email(){
    return (
          <div className="longBox">
            {makeLabel("signupEmail", "Email")}
            {makeInput("email", "email", formClassError.emailErrorClass, (txt) => setEmail(txt.target.value))}
            {makeErrorMessage(formError.emailError)}
          </div>
    )
  }

  function Password(){
    return (
            <div className="longBox">
              {makeLabel("signupPassword", "Password")}
              {makeInput("password", "password", formClassError.pwErrorClass, (txt) => setPassword(txt.target.value))}
              {makeErrorMessage(formError.pwError)}
            </div>
          )
  }

  function PasswordRepeat(){
    return (
              <div className="longBox">
                {makeLabel("confirmPassword", "Repeat your password")}
                {makeInput("password", "repeat", formClassError.repeatErrorClass, (txt) => setPasswordRepeat(txt.target.value))}
                {makeErrorMessage(formError.repeatError)}
              </div>
          )
  }

  function FirstRow(){
    return (
            <div className="firstRow">
              {FirstName()}
              {LastName()}
              {Weight()}
            </div>
            )
  }

  function SignupButton(){
    return (
            <div className="signupButton">
            {makeButton(
              "",
              "btn btn-success btn-block btn-lg gradient-custom-4 text-body",
              () => doSignup(),
              "Register"
            )}
          </div>
          )
  }

  function BackToLogin(){
    return (
              <p className="text-center text-muted mt-5 mb-0">
                Have an account already?{" "}
                {makeLink("/#/", "fw-bold text-body", "Login here")}
              </p>
        )
  }
  function errorDiv(){
    return (
      <div className ="text-center pt-3">
        {makeErrorMessage(errorMessage)}
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card ">
        <h2 className="text-center"> Sign Up </h2>

        {FirstRow()}
        {Email()}
        {Password()}
        {PasswordRepeat()}
        {errorDiv()}
        <SignupButton/>
      </div>

      <BackToLogin/>

      <main>
      {isOpen && <VerifyModal/>}
      </main>
    </div>
  );
}
export default Signup;
