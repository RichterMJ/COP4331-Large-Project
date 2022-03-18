import React from "react";
import Login from "../components/Login";
import LoginPageHeader from "../components/LoginPageHeader";

function LoginPage() {
  return (
    <div className="content">
      <LoginPageHeader/>
      <Login/>
    </div>
  );
}
export default LoginPage;
