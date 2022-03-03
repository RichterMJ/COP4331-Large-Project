import React from "react";

function LoginPageHeader() {
  return (
    <div id ="LoginHeader" >
      <Logo/>
    <h1 className="left-text headerText" id="title">
      GitFit
    </h1>
    </div>
  );
}
function Logo(){
  const fileLocation = "./assets/thirdLogo.png"
  return(<img id ="mainLogo" src ={fileLocation} alt="logo for gitfit"></img>)
}
export default LoginPageHeader;
