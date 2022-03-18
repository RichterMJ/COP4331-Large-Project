import React, { Component } from "react";

function ForgotPassword() {
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
  const doResetPassword = async (event) => {
    // implement reset password function
    // console.log("reset button clicked!");
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          <h2 className="text-center">Reset Password</h2>

          <br></br>
          <div className="d-flex flex-column">
            <div className="">
              {makeInputDiv("Password", "resetPassword", "w-50", "password")}
            </div>

            <div className="">
              {makeInputDiv(
                "Confirm Password",
                "confirmResetPassword",
                "w-50",
                "password"
              )}
            </div>
          </div>

          <div className="pt-3">
            {makeActionButton(
              "button",
              "btn btn-success btn-lg",
              () => doResetPassword(),
              "Reset Password",
              "resetPasswordButton"
            )}
          </div>
          <div id="formFooter"></div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
