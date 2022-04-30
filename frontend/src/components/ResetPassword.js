import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import buildPath from "./path";
import { blankValidator, makeErrorMessage, addInvalidStyle, emailValidator, passwordValidator} from "./Validators/InputValidator";
import Modal from "./Modals/ResponseModal";
import { makePTag, makeInputDiv, makeActionButton, makeDiv, makeButton, makeLink, makeSpan, makeH2 } from "./divHelpers/divHelpers";
import ResponseModal from "./Modals/ResponseModal";
import {JSONRequest} from "./RESTHelpers/JSONRequest"

const MD5 = require('md5');

function ResetPassword() {
  const search = useLocation().search;
  const userId = new URLSearchParams(search).get("userId");
  const [errorMessage, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [passwordReset, setPasswordReset] = useState("");
  const [confirmPasswordReset, setConfirmPasswordReset] = useState("");
  const [formError, setFormError] = useState({});


  function isValidResetPasswordInputs(email, password, confirmPassword){
    let errors = {};
    errors.emailError = emailValidator(email);
    errors.passwordError = passwordValidator(password, true);
    if ((errors.confirmPasswordError = passwordValidator(confirmPassword, false)) == ""){
      if( confirmPassword != password){
        errors.confirmPasswordError = "Passwords not matching"
      }
    }
    setFormError(errors);
    return (errors.emailError == "" && errors.passwordError == "" && errors.confirmPasswordError == "");
  }
  function prepareResetPasswordJSON(){
    const resetPasswordData = {
      userId: userId,
      email: email,
      newPassword: MD5(confirmPasswordReset)
    };
    console.log(resetPasswordData)

    return JSON.stringify(resetPasswordData);
  }
  function handleResetPasswordRes(res){
    if (res.error != 0) {
      console.log(res.error);
      setMessage("Error occurred");
    } else {
      setIsOpen(true);
      //window.location.href = "/";
    }
  }
  const doResetPassword = async (event) => {
    if (!isValidResetPasswordInputs(email, passwordReset, confirmPasswordReset)){
      return;
    }

    const resetPasswordJSON = prepareResetPasswordJSON();
    
    let res = await JSONRequest("POST", resetPasswordJSON,"api/users/forgotPassword/forgotPasswordReset");
    handleResetPasswordRes(res);
    
  };
  

  function makeResetPasswordInputs(){
    return (
      <div className="d-flex flex-column">
              {makeInputDiv("email", "resetEmail", `w-50 mt-2 form-control ${addInvalidStyle(formError.emailError)}`, email, "resetEmail", "Email Reset", setEmail)}
              {makeErrorMessage(formError.emailError)}
              {makeInputDiv("password", "resetPassword",`w-50 mt-2 form-control ${addInvalidStyle(formError.passwordError)}`, passwordReset, "resetPassword", "Password", setPasswordReset)}
              {makeErrorMessage(formError.passwordError)}
              {makeInputDiv("password", "confirmResetPassword", `w-50 mt-2 form-control ${addInvalidStyle(formError.confirmPasswordError)}`, confirmPasswordReset, "confirmResetPassword", "Confirm Password", setConfirmPasswordReset)}
              {makeErrorMessage(formError.confirmPasswordError)}
            
      </div>
    )
  }
  function makeFooter(){
    return (<div id="formFooter" className="pt-2">{makeLink("/#/", "pt-2 pl-1 text-danger","Cancel")}</div>);

  }
  return (
    <div className="container" data-testid="resetPassword-container">
      <div className="card">
        <div className="card-body">

          {makeH2("", "text-center pb-4", "Reset Password")}
          
          {makeResetPasswordInputs()}

          {makeActionButton(
            "button",
            "btn btn-success btn-lg mt-3",
            () => doResetPassword(),
            "Done",
            "resetPasswordButton"
          )}
          {makeErrorMessage(errorMessage)}

          {makeFooter()}
          
        </div>
      </div>
      <main>
        {isOpen && <ResponseModal setIsOpen={setIsOpen} responseMessage="Password has been reset successfully" />}
      </main>
    </div>
  );
}
export default ResetPassword;
