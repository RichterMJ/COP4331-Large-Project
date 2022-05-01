import React from "react";
import Logo from "./Logo";
function LoginPageHeader() {
  return (
    <div className="container">
      <div id ="LoginHeader" >
        <Logo/>
      <h1 className="left-text headerText" id="title">
        GitFit
      </h1>
      </div>
    </div>
  );
}

export default LoginPageHeader;
