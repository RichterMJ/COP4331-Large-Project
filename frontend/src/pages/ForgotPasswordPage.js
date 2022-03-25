import React from "react";
import ForgotPassword from "../components/ForgotPassword";
import LoginPageHeader from "../components/LoginPageHeader";

function LoginPage() {
  return (
    <div className="content">
      <LoginPageHeader />
      <ForgotPassword />
    </div>
  );
}
export default LoginPage;
