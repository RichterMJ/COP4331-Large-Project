import React, { useState } from "react";
import ResponseModal from "./Modals/ResponseModal";
import buildPath from "./path";
import {JSONRequest} from "./RESTHelpers/JSONRequest"
import { blankValidator, addInvalidStyle, makeErrorMessage, emailValidator} from "./Validators/InputValidator";
import { makePTag,makeInputDiv, makeActionButton, makeDiv, makeButton, makeLink, makeSpan, makeH2 } from "./divHelpers/divHelpers";

function ForgotPassword() {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [inputError, setInputError] = useState("");

  function prepareJSON(){
    const emailRetriver = {
      email: userEmail,
    };

    return JSON.stringify(emailRetriver);
  }
  function handleForgotPasswordRes(res){
    if (res.error != 0) {
      setMessage("Error occurred");
    } else {
      setMessage("");
      setIsOpen(true);
    }
  }
  // return true if there is no invalid inputs, false otherwise
  function isValidForgotPasswordInputs(email){
    let inputError = emailValidator(email);
    setInputError(inputError);
    return (inputError == "");
  }
  const sendResetLink = async (event) => {

    if (!isValidForgotPasswordInputs(userEmail)){
      return // programs stops if there is error
    }

    const emailJSON = prepareJSON();
    
    let res = await JSONRequest("POST", emailJSON,"api/users/forgotPassword/forgotPasswordEmail");
    handleForgotPasswordRes(res);

  };
  function makeEmailInput(){
    return(
      <div className="d-flex flex-column align-item-center justify-content-center">
        {makeInputDiv("email", "forgotPasswordEmail", `form-control ${addInvalidStyle(inputError)}`, userEmail,"email","email", setUserEmail)}
        {makeErrorMessage(inputError)}
      </div>
    );
  }
  function makeFooter(){
    return (<div id="formFooter" className="pt-2">{makeLink("/#/","text-danger", "Cancel")}</div>);
  }

  return (
    <div className="container" data-testid="forgotPassword-container">
      <div className="card">
        <div className="card-body text-center">

          {makeH2("", "pb-4", "Forgot Password")}
          
          {makeEmailInput()}
            
          {makeActionButton(
            "button",
            "btn btn-success btn-lg mt-3",
            () => sendResetLink(),
            "Confirm",
            "resetPasswordButton"
          )}

          {makeErrorMessage(errorMessage)}

          {makeFooter()}
          
        </div>
      </div>
      <main>
        {isOpen && <ResponseModal setIsOpen={setIsOpen} responseMessage={`Reset link has been sent ${userEmail}. Please check your Inbox`} />}
      </main>
    </div>
  );
}

export default ForgotPassword;
