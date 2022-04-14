import React from "react";
import Login from "../components/Login";
import LoginPageHeader from "../components/LoginPageHeader";

function LoginPage(props) {
  return (
    <div className="content">
      <LoginPageHeader/>
      <Login user = {props.user}/>
    </div>
  );
}
export default LoginPage;
