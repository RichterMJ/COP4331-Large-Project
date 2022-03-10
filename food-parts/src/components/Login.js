import React from "react";

function Login() {
  const doLogin = async (event) => {
    event.preventDefault();
    alert("doIt()");
  };

  function makeTextInput (id, name,placeholder){
    return(<input
              className="form-control"
              type="text"
              id={id}
              name={name}
              placeholder={placeholder}
            />
          )
  }

  function makeActionButton(type,className,event,text,id=""){
    return(<button
           type = {type}
           className={className}
           onClick = {event}
           id = {id}>
             {text}
           </button>)
  }

  function makeLinkDiv ( className, href, content){
    return (<a className={className} href={href}>
              {content}
            </a>)
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          <h2 className="text-center">Log in</h2>
          {makeTextInput("username","login","email")}
            <br></br>
          {makeTextInput("password","login","password")}
            <div>
              {makeActionButton("button","btn btn-block",()=>doLogin(),"Login","loginButton")}
            </div>
          <div id="formFooter">
            {makeLinkDiv("underLineHover","s","Forgot Password?")}
            <br></br>
            {makeLinkDiv("underLineHover","signup","Create an Account")}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
