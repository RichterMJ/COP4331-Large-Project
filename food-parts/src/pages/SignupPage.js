import React from "react";
import Signup from "../components/Signup";
import LoginPageHeader from "../components/LoginPageHeader";

function SignupPage() {
  return (
    <div className="container">
      <LoginPageHeader/>
      <Signup />
    </div>
  );
}
export default SignupPage;
