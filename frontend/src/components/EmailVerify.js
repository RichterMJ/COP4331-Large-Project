import React from "react";
import buildPath from "./path";

function EmailVerify(){

    const verify = async () => {
        const url = window.location.href;

        const verifyData = {
            userId: url.substring(url.indexOf('=') + 1) //Gets part of url with userId only
        }
        console.log(verifyData.userId);
        const verifyJSON = JSON.stringify(verifyData);

        try {
            const response = await fetch(buildPath("api/users/emailVerification/verifyEmail"), {
              method: "POST",
              body: verifyJSON,
              headers: { "Content-Type": "application/json" },
            });
            
            let res = JSON.parse(await response.text());
      
            console.log(res);
      
            if (res.error != 0) {
              console.log('An error has occured');
            } else {
              document.getElementById('boxText').innerHTML = "Success!";
              window.setTimeout(() => {window.location.href = "/login"}, 1500);
            }
          } catch (e) {
            console.log(e.toString());
            return;
          }
    }

    function makeH2(id, className, text){
        return (<h2 id={id} className={className}>{text}</h2>)
    }

    function makeButton(id, className, onClick, txt) {
        return (
          <button type="button" id={id} className={className} onClick={onClick}>
            {txt}
          </button>
        );
    }

    return (
            <div className="container">
                <div className="card">
                    <div className="card-body">
                        {makeH2("boxText", "text-center", "Git Fit Account Verification")}
                        <br></br>
                        <div id="verifyButtonDiv">
                            {makeButton("verifyButton", "btn btn-success btn-block btn-lg  text-body", ()=> verify(), "Verify")}
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default EmailVerify;