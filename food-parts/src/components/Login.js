import React from "react";

function Login() {
  const doLogin = async (event) => {
    event.preventDefault();
    alert("doIt()");
  };
  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          <h2 className="text-center">Log In</h2>
          <form onSubmit={doLogin}>
            <input
              className="form-control"
              type="text"
              id="username"
              name="login"
              placeholder="email"
            />
            <br></br>
            <input
              className="form-control"
              type="text"
              id="password"
              name="login"
              placeholder="password"
            />
            <div>
              <button
                type="button"
                className="btn btn-block"
                onSubmit={doLogin}
              >
                Log In
              </button>
            </div>
          </form>
          <div id="formFooter">
            <a className="underlineHover" href="#">
              Forgot Password?
            </a>
            <br></br>
            <a className="underlineHover" href="signup">
              Create an account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
