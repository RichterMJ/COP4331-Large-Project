import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import buildPath from "./path";
import { blankValidator, makeErrorMessage, addInvalidStyle, emailValidator, passwordValidator} from "./Validators/InputValidator";
import Modal from "./Modals/ResponseModal";
import { makePTag, makeInputDiv, makeActionButton, makeDiv, makeButton, makeLink, makeSpan, makeH2 } from "./divHelpers/divHelpers";
import ResponseModal from "./Modals/ResponseModal";
import postJSON from "./RESTHelpers/PostHelpers"

function ResetPassword() {
  const search = useLocation().search;
  const userId = new URLSearchParams(search).get("userId");
  const [errorMessage, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [passwordReset, setPasswordReset] = useState("");
  const [confirmPasswordReset, setConfirmPasswordReset] = useState("");
  const [formError, setFormError] = useState({});


  function validate (email, password, confirmPassword){
    const errors = {};
    errors.email = emailValidator(email);
    errors.password = passwordValidator(password, true);
    if ((errors.confirmPassword = passwordValidator(confirmPassword, false)) == ""){
      if( confirmPassword != password){
        errors.confirmPassword = "Passwords not matching"
      }
    }
    return errors;
  }
  function prepareResetPasswordJSON(){
    const resetPasswordData = {
      userId: userId,
      email: email,
      confirmPasswordReset: confirmPasswordReset
    };

    return JSON.stringify(resetPasswordData);
  }
  function handleResetPasswordRes(res){
    if (res.error != 0) {
      setMessage("Error occurred");
    } else {
      setIsOpen(true);
      //window.location.href = "/";
    }
  }
  const doResetPassword = async (event) => {
    setFormError(validate(email, passwordReset, confirmPasswordReset));

    if (formError.length == 0 ){
      return // programs stops if there is error
    }

    const resetPasswordJSON = prepareResetPasswordJSON();
    
    let res = await postJSON(resetPasswordJSON,"api/users/forgotPassword/forgotPasswordReset");
    handleResetPasswordRes(res);
    
  };
  

  function makeResetPasswordInputs(){
    return (
      <div className="d-flex flex-column">
              {makeInputDiv("email", "resetEmail", `w-50 mt-2 form-control ${addInvalidStyle(formError.email)}`, "", "resetEmail", "Email Reset", setEmail)}
              {makeErrorMessage(formError.email)}
              {makeInputDiv("password", "resetPassword",`w-50 mt-2 form-control ${addInvalidStyle(formError.password)}`, "", "resetPassword", "Password", setPasswordReset)}
              {makeErrorMessage(formError.password)}
              {makeInputDiv("password", "confirmResetPassword", `w-50 mt-2 form-control ${addInvalidStyle(formError.confirmPassword)}`, "", "confirmResetPassword", "Confirm Password", setConfirmPasswordReset)}
              {makeErrorMessage(formError.confirmPassword)}
            
      </div>
    )
  }
  function makeFooter(){
    return (<div id="formFooter" className="pt-2">{makeLink("/", "pt-2 pl-1 text-danger","Cancel")}</div>);

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
