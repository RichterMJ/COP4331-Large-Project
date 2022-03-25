import React, { useState } from "react";

import ResponseModal from "./Modals/ResponseModal";
import VerifyModal from "./VerifyModal";
import AddFoodModal from "../components/AddFoodModal";
import {makeButton, makeLink, makeSpan} from "./divHelpers/divHelpers";


// var ph = require('./path.js');
import buildPath from "./path";

function Signup() {
  const [errorMessage, setMessage] = useState("");
  let errors = [];

  const [isOpen, setIsOpen] = useState(false);

  function isProperSignup(...fields) {
    //Note that weight is the last index in fields
    for (let i = 0; i < 4; i++) if (fields[i].length <= 0) errors.push(i);

    if (fields[3] != fields[4]) errors.push(4);

    if (isNaN(fields[5]) || fields[5].length == 0) errors.push(5);

    return errors.length == 0;
  }

  function addErrors(...fields) {
    for (let i = 0; i < 4; i++)
      if (errors.includes(i)) {
        //Add red warning to fields[i]
      }

    if (errors.includes(4)) {
      //Add red warning to fields[4]
    }

    if (errors.includes(5)) {
      //Add red warning to fields[5]
    }
  }

  function addDuplicateEmailWarning() {}

  const doSignup = async (event) => {
    //event.preventDefault();
    console.log("Hello");
    errors = [];

    let fName = document.getElementById("fName");
    let lName = document.getElementById("lName");
    let weight = document.getElementById("weight");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let repeat = document.getElementById("repeat");

    if (
      !isProperSignup(
        fName.value,
        lName.value,
        email.value,
        password.value,
        repeat.value,
        weight.value
      )
    ) {
      console.log(errors.length);
      addErrors(fName, lName, email, password, repeat, weight);
      return;
    }

    const signupInfo = {
      firstname: fName.value,
      lastname: lName.value,
      weight: Number(weight.value),
      email: email.value,
      password: password.value,
    };

    const jsonPayload = JSON.stringify(signupInfo);

    try {
      const response = await fetch(buildPath("api/users/register"), {
        method: "POST",
        body: jsonPayload,
        headers: { "Content-Type": "application/json" },
      });

      let res = JSON.parse(await response.text());

      console.log(res);

      if (res.id <= 0) {
        setMessage("Duplicate username");
      } else {
        const user = {
          firstName: res.firstName,
          lastName: res.lastName,
          id: res.id,
        };
        //localStorage.setItem("user_data", JSON.stringify(user));
        setMessage("");
        setIsOpen(true);
      }
    } catch (e) {
      console.log(e.toString());
      return;
    }
  };

  function makeLabel(title, txt, className = "") {
    return (
      <label className={className + " signupLabel form-label"} htmlFor={title}>
        {txt}
      </label>
    );
  }

  function makeInput(type, id, className = "") {
    return (
      <input
        type={type}
        id={id}
        className={className + " form-control form-control-lg"}
      />
    );
  }

  function makeModal() {
    return null;
  }

  return (
    <div className="container">
      <div className="card">
        <h2 className="text-center"> Sign Up </h2>

        <div className="firstRow">
          <div className="fNameBox">
            {makeLabel("signupFName", "First Name")}
            {makeInput("text", "fName", "fNameInput")}
          </div>

          <div className="lNameBox">
            {makeLabel("signupLName", "Last Name", "lNameLabel")}
            {makeInput("text", "lName", "lNameInput")}
          </div>

          <div className="weightBox">
            {makeLabel("signupWeight", "Weight", "weightLabel")}
            <div className="input-group">
              {makeInput("text", "weight", "weightInput")}
              <div className="input-group-append">
                {makeSpan("input-group-text", "lbs")}
              </div>
            </div>
          </div>
        </div>

        <div className="longBox">
          {makeLabel("signupEmail", "Email")}
          {makeInput("email", "email")}
        </div>

        <div className="longBox">
          {makeLabel("signupPassword", "Password")}
          {makeInput("password", "password")}
        </div>

        <div className="longBox">
          {makeLabel("confirmPassword", "Repeat your password")}
          {makeInput("password", "repeat")}
        </div>

        <div className="signupButton">
          {makeButton(
            "",
            "btn btn-success btn-block btn-lg gradient-custom-4 text-body",
            () => doSignup(),
            "Register"
          )}
        </div>

        <p className="text-center text-muted mt-5 mb-0">
          Have an account already?{" "}
          {makeLink("/", "fw-bold text-body", "Login here")}
        </p>
      </div>

      <main>

       // Idk if this one or the one below is the correct one{isOpen && <ResponseModal setIsOpen={setIsOpen} responseMessage="Email has been sent for verfication. Please check your inbox" />}

      {isOpen && <VerifyModal/>}

      </main>
      <br></br>
      <AddFoodModal/>
    </div>
  );
}
export default Signup;
