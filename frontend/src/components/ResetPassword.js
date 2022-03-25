import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import buildPath from "./path";
import { blankValidator} from "./Validators/InputValidator";
import Modal from "./Modals/ResponseModal";
import { makePTag, makeInputDiv, makeActionButton, makeDiv, makeButton, makeLink, makeSpan, makeH2 } from "./divHelpers/divHelpers";
import ResponseModal from "./Modals/ResponseModal";

function ResetPassword() {
  const search = useLocation().search;
  const userId = new URLSearchParams(search).get("userId");
  const [errorMessage, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const doResetPassword = async (event) => {
    // implement reset password function
    let password = document.getElementById("resetPassword");
    let confirmPassword = document.getElementById("confirmResetPassword");

    if (blankValidator(confirmPassword, password)) {
      return;
    }
    if (confirmPassword.value != password.value) {
      return;
    }

    const resetPasswordData = {
      userId: userId,
      newPassword: password.value,
    };

    console.log(resetPasswordData);

    const resetPasswordJSON = JSON.stringify(resetPasswordData);

    try {
      const response = await fetch(
        buildPath("api/users/forgotPassword/forgotPasswordReset"),
        {
          method: "POST",
          body: resetPasswordJSON,
          headers: { "Content-Type": "application/json" },
        }
      );

      let res = JSON.parse(await response.text());

      console.log(res);

      if (res.error != 0) {
        setMessage("Error occurred");
      } else {
        setIsOpen(true);
        //window.location.href = "/";
      }
    } catch (e) {
      console.log(e.toString());
      return;
    }
    
  };

  function makeResetPasswordInputs(){
    return (
      <div className="d-flex flex-column">
              {makeInputDiv("Password", "resetPassword", "w-50 pt-2", "password","password")}
              {makeInputDiv(
                "Confirm Password",
                "confirmResetPassword",
                "w-50 pt-2",
                "confirmed password",
                "confirm password"
              )}
      </div>
    )
  }
  return (
    <div className="container">
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
          {errorMessage != "" && makePTag("text-danger", errorMessage)}

          <div id="formFooter" className="pt-2">{makeLink("/", "pt-2 pl-1","Cancel")}</div>
          
        </div>
      </div>
      <main>
        {isOpen && <ResponseModal setIsOpen={setIsOpen} responseMessage="Password has been reset successfully" />}
      </main>
    </div>
  );
}
export default ResetPassword;
