import React from "react";

function Login() {
  const [errorMessage, setMessage] = useState("");

  const doLogin = async (event) => {
    let email = document.getElementById('email');
    let password = document.getElementById('password');

    const loginData = {
      email: email.value,
      password: password.value
    };

    const loginJSON = JSON.stringify(loginData);

    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        body: loginJSON,
        headers: { "Content-Type": "application/json" },
      });
      
      let res = JSON.parse(await response.text());

      console.log(res);

      if (res.error == 1) {
        setMessage("Incorrect email/password");
      } else {
        const user = {
          firstName: res.firstName,
          lastName: res.lastName,
          id: res.userId,
        };
        localStorage.setItem("user_data", JSON.stringify(user));
        setMessage("");
        //window.location.href = "/userpage";
      }
    } catch (e) {
      console.log(e.toString());
      return;
    }
  };

  function makeTextInput (id,name,placeholder){
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
          {makeTextInput("email","login","email")}
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
