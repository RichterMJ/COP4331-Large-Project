import React, { useState } from "react";
import VerifyModal from "./Modals/VerifyModal";
import {makeButton, makeLink, makeSpan} from "./divHelpers/divHelpers";
import {matchingPasswords, isBlank} from "./Validators/LoginValidators";
import postJSON from "./RESTHelpers/PostHelpers";


// var ph = require('./path.js');
import buildPath from "./path";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [weight, setWeight] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const [fnErrorClass, setFNErrorClass] = useState("");
  const [lnErrorClass, setLNErrorClass] = useState("");
  const [weightErrorClass, setWeightErrorClass] = useState("");
  const [emailErrorClass, setEmailErrorClass] = useState("");
  const [pwErrorClass, setPWErrorClass] = useState("");
  const [repeatErrorClass, setRepeatErrorClass] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  /*function isProperSignup(...fields) {
    //Note that weight is the last index in fields
    for (let i = 0; i < 4; i++) if (fields[i].length <= 0) errors.push(i);

    if (fields[3] != fields[4]) errors.push(4);

    if (isNaN(fields[5]) || fields[5].length == 0) errors.push(5);

    return errors.length == 0;
  }*/

  function makeSignupJSON(){
    const signupData = {
      firstname: firstName,
      lastname: lastName,
      weight: Number(weight),
      email: email,
      password: password
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

  function handleSignupRes(res){
      if (res.id <= 0) {
      } else {
        const emailJSON = makeEmailJSON(res);

        try{
          //For when this method is complete
          let emailRes = postJSON(emailJSON, "api/users/emailVerification/sendVerificationEmail");
          handleSendEmailResponse(emailRes);
        }catch(e){
          console.log(e);
        }
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

  function setClassErrorArray(){
    return new Array(setFNErrorClass, setLNErrorClass, setWeightErrorClass, setEmailErrorClass, setPWErrorClass, setRepeatErrorClass);  
  }

  const doSignup = async (event) => {

    console.log(firstName);
    if(!matchingPasswords(password, passwordRepeat, setPWErrorClass, setRepeatErrorClass) || isBlank(fieldsArray(), setClassErrorArray()))
      return;

    //Make a different validity checker

    const signupJSON = makeSignupJSON();

    try{
        //For when this method is complete
        let res = postJSON(signupJSON, "api/users/register");
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
                {makeInput("text", "fName", " " + fnErrorClass, (txt) => setFirstName(txt.target.value))}
            </div>
            )
  }

  function LastName(){
    return (
            <div className="lNameBox">
              {makeLabel("signupLName", "Last Name", "lNameLabel")}
              {makeInput("text", "lName", "lNameInput " + lnErrorClass, (txt) => setLastName(txt.target.value))}
            </div>
          )
  }

  function Weight(){
    return (
            <div className="weightBox">
                {makeLabel("signupWeight", "Weight", "weightLabel")}
                <div className="input-group">
                  {makeInput("text", "weight", "weightInput " + weightErrorClass, (txt) => setWeight(txt.target.value))}
                  <div className="input-group-append">
                    {makeSpan("input-group-text", "lbs")}
                  </div>
                </div>
            </div>
          )
  }

  function Email(){
    return (
          <div className="longBox">
            {makeLabel("signupEmail", "Email")}
            {makeInput("email", "email", emailErrorClass, (txt) => setEmail(txt.target.value))}
          </div>
    )
  }

  function Password(){
    return (
            <div className="longBox">
              {makeLabel("signupPassword", "Password")}
              {makeInput("password", "password", pwErrorClass, (txt) => setPassword(txt.target.value))}
            </div>
          )
  }

  function PasswordRepeat(){
    return (
              <div className="longBox">
                {makeLabel("confirmPassword", "Repeat your password")}
                {makeInput("password", "repeat", repeatErrorClass, (txt) => setPasswordRepeat(txt.target.value))}
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
                {makeLink("/", "fw-bold text-body", "Login here")}
              </p>
        )
  }


  return (
    <div className="container">
      <div className="card">
        <h2 className="text-center"> Sign Up </h2>

        {FirstRow()}
        {Email()}
        {Password()}
        {PasswordRepeat()}

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
