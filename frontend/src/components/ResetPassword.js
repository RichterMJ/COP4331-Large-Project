import React from "react";

function ResetPassword() {
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
    console.log("reset button clicked!");
    document.getElementById("resetPasswordDiv").style.display = "none";
    document.getElementById("resetPasswordDiv").style.display = "block";
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          <h2 className="text-center">Reset Password</h2>

          <br></br>
          <div className="resetPasswordDiv">
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
                "Done",
                "resetPasswordButton"
              )}
            </div>
          </div>
          <div id="formFooter">{makeLinkDiv("pt-2 pl-1", "/", "Cancel")}</div>
        </div>
      </div>
    </div>
  );
}
export default ResetPassword;
