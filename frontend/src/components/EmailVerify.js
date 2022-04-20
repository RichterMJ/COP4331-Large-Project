import React, {useState} from "react";
import buildPath from "./path";
import {makeButton, makeH2} from "./divHelpers/divHelpers";
import {JSONRequest} from "./RESTHelpers/JSONRequest"

function EmailVerify(){

    const [boxTextMessage, setMessage] = useState('Git Fit Account Verification');

    const verify = async () => {
        const url = window.location.href;

        const verifyData = {
            userId: url.substring(url.indexOf('=') + 1) //Gets part of url with userId only
        }
        console.log(verifyData.userId);
        const verifyJSON = JSON.stringify(verifyData);

        try {
            
            let res =  await JSONRequest("POST", verifyJSON, "api/users/emailVerification/verifyEmail");
      
            if (res.error != 0) {
              console.log(res.error);
            } else {
              setMessage('Success!');
              window.setTimeout(() => {window.location.href = "/"}, 1500);
            }
          } catch (e) {
            console.log(e.toString());
            return;
          }
    }

    return (
            <div className="container">
                <div className="card">
                    <div className="card-body">
                        {makeH2("boxText", "text-center", boxTextMessage)}
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
