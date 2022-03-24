import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import buildPath from "./path";
import { blankValidator} from "./Validators/InputValidator";
import Modal from "../components/Modal";
import { makePTag, makeActionButton, makeDiv, makeButton, makeLink, makeSpan, makeH2 } from "./divHelpers/divHelpers";

function ResetPassword() {
  const search = useLocation().search;
  const userId = new URLSearchParams(search).get("userId");
  const [errorMessage, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  function makeInputDiv(label, id, className, type) {
    return (
      <div className={className}>
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
        <input className="form-control" type={type} id={id} />
      </div>
    );
  }

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

  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          <h2 className="text-center">Reset Password</h2>

          <br></br>
          <div className="resetPasswordDiv">
            <div className="d-flex flex-column">
              {makeInputDiv("Password", "resetPassword", "w-50", "password")}
              {makeInputDiv(
                "Confirm Password",
                "confirmResetPassword",
                "w-50",
                "password"
              )}
            </div>

            {makeActionButton(
              "button",
              "btn btn-success btn-lg mt-3",
              () => doResetPassword(),
              "Done",
              "resetPasswordButton"
            )}
            {errorMessage != "" && makePTag("text-danger", errorMessage)}
          </div>

          <div id="formFooter" className="pt-2">{makeLink("/", "pt-2 pl-1","Cancel")}</div>
        </div>
      </div>
      <main>
        {isOpen && <Modal setIsOpen={setIsOpen} responseMessage="Password has been reset successfully" />}
      </main>
    </div>
  );
}
export default ResetPassword;
