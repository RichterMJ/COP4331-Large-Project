import React, { useState } from "react";
import Modal from "../components/Modal";
import buildPath from "./path";
import { blankValidator} from "./Validators/InputValidator";
import { makePTag, makeActionButton, makeDiv, makeButton, makeLink, makeSpan, makeH2 } from "./divHelpers/divHelpers";

function ForgotPassword() {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
 

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
  
  const sendResetLink = async (event) => {
    let email = document.getElementById("resetEmail");
    setUserEmail(email.value);

    if (blankValidator(email)) {
      return;
    }

    const emailRetriver = {
      email: email.value,
    };

    const emailJSON = JSON.stringify(emailRetriver);

    try {
      const response = await fetch(
        buildPath("api/users/forgotPassword/forgotPasswordEmail"),
        {
          method: "POST",
          body: emailJSON,
          headers: { "Content-Type": "application/json" },
        }
      );

      let res = JSON.parse(await response.text());

      console.log(res);

      if (res.error != 0) {
        setMessage("Error occurred");
      } else {
        const user = {
          error: res.error,
        };
        localStorage.setItem("user_data", JSON.stringify(user));
        setMessage("");
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
        <div className="card-body rounded-1">
          {makeH2("", "text-center", "Forgot Password")}

          <br></br>
          <div className="text-center">
            <div className="d-flex align-item-center justify-content-center">
              {makeInputDiv(
                "Please enter your email",
                "resetEmail",
                "w-50",
                "email"
              )}
            </div>

            <div className="pt-3">
              {makeActionButton(
                "button",
                "btn btn-success btn-lg",
                () => sendResetLink(),
                "Confirm",
                "resetPasswordButton"
              )}
            </div>
            {errorMessage != "" && makePTag("text-danger pt-2", errorMessage)}

            <div id="formFooter" className="pt-2">{makeLink("/","pt-2 pl-1 text-danger", "Cancel")}</div>
          </div>
        </div>
      </div>
      <main>
        {isOpen && <Modal setIsOpen={setIsOpen} responseMessage={`Reset link has been sent ${userEmail}. Please check your inbox.`} />}
      </main>
    </div>
  );
}

export default ForgotPassword;
