import React from "react";
import LoginPageHeader from "../components/LoginPageHeader";

function InvalidPage() {
  return (
    <div className="content">
      <LoginPageHeader/>
      <h4 className="text-center">Sorry, invalid URL request.</h4>
    </div>
  );
}
export default InvalidPage;