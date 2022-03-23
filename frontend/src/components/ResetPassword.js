import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import buildPath from "./path";

function ResetPassword() {
  const search = useLocation().search;
  const userId = new URLSearchParams(search).get("userId");
  const [errorMessage, setMessage] = useState("");

  function blankValidator(...fields) {
    let isBlanked = false;
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].value == "") {
        fields[i].classList.add("is-invalid");
        isBlanked = true;
      } else {
        fields[i].classList.remove("is-invalid");
      }
    }

    return isBlanked;
  }

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
  function makeActionButton(type, className, event, text, id = "") {
    return (
      <button type={type} className={className} onClick={event} id={id}>
        {text}
      </button>
    );
  }
  function makeLinkDiv(className, href, content) {
    return (
      <div className={className}>
        <a className="text-danger" href={href}>
          {content}
        </a>
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
        setMessage("Error!");
      } else {
        window.location.href = "/";
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
          </div>
          <div id="formFooter">{makeLinkDiv("pt-2 pl-1", "/", "Cancel")}</div>
        </div>
      </div>
    </div>
  );
}
export default ResetPassword;
