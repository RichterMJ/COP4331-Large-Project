import React from "react";

function Signup() {
  return (
    <div className="container">
      <h2 className="text-center"> Sign Up </h2>
      <form>
        <div>
          <input
            type="text"
            id="signupName"
            className="form-control form-control-lg"
          />
          <label className="form-label" for="signupName">
            Your Name
          </label>
        </div>

        <div>
          <input
            type="email"
            id="signupEmail"
            className="form-control form-control-lg"
          />
          <label className="form-label" for="signupEmail">
            Your Email
          </label>
        </div>

        <div>
          <input
            type="password"
            id="signupPassword"
            className="form-control form-control-lg"
          />
          <label className="form-label" for="signupPassword">
            Password
          </label>
        </div>

        <div>
          <input
            type="password"
            id="confirmedPassword"
            className="form-control form-control-lg"
          />
          <label className="form-label" for="confirmPassword">
            Repeat your password
          </label>
        </div>

        <div>
          <button
            type="button"
            className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
          >
            Register
          </button>
        </div>

        <p className="text-center text-muted mt-5 mb-0">
          Have already an account?{" "}
          <a href="/" class="fw-bold text-body">
            <u>Login here</u>
          </a>
        </p>
      </form>
    </div>
  );
}
export default Signup;
