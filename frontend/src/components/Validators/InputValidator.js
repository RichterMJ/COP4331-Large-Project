import React from 'react';

// this function receive string 
// then check blank and format xxx@xxx.xxx
// return empty string for valid and message error string for invalid
function emailValidator(email)
{
  const regrex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!email){
    return "email is required";
  } 
  if (!regrex.test(email)){
   return "email is need to be in format of xxx@xxx.xxx";
  }
  return "";
}

// this function receive string 
// then check blank and format at least 8 character, one letter and one number
// return empty string for valid and message error string for invalid
function passwordValidator(password, needValidFormat)
{
  const regrex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!password){
    return "password is required";
  } 
  if (needValidFormat){
    if (!regrex.test(password)){
      return "password must contains at least 8 character, one letter and one number";
    }
  }
  return "";
}
function blankValidator(...fields){
  let ret = false;
  for(let i = 0; i < fields.length; i++){
      console.log(fields[i].length);
      if(fields[i].length == 0){
          fields[i].classList.add("in-valid");
          ret = true;
      }else{
        fields[i].classList.remove("in-valid");
      }
  }
  return ret;
}
// receive a string of error
// if error exist make a P tag with error message
function makeErrorMessage(error){
  if (error){
    return <p className="text-danger mb-0">error</p>;
  }
  return;
}
// this function add invalid bootstrap for invalid input
// receive a string of error
// return "" is no error
function addInvalidStyle(isError){
  return isError ? "is-invalid" : "";
}
export {emailValidator, passwordValidator, blankValidator, makeErrorMessage, addInvalidStyle};
