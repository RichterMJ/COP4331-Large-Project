import React, {useState} from "react";
import {makeActionButton, makeButton, makeInputDiv, makeLabel, makeSpan} from "../divHelpers/divHelpers";
import {addInvalidStyle, makeErrorMessage, weightValidator} from "../Validators/InputValidator";
import { RiCloseLine } from "react-icons/ri";
import postJSON from "../RESTHelpers/PostHelpers";


function MyAccountModal({user, open, close}) {
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [userWeight, setUserWeight] = useState(user.weight);
    const [isEditing, setIsEditting] = useState(false);
    const [editFormError, setEditFormError] = useState({
        firstNameError: "",
        lastNameError: "",
        weightError: ""
    });
    const [errorMessage, setMessage] = useState("");
    const storage = require("../tokenStorage.js");

    function isValidEditInputs(firstName, lastName, weight){
        let errors = {};
        errors.firstNameError = (!firstName) ? "Invalid First Name" : "";
        errors.lastNameError = (!lastName) ? "Invalid Last Name" : "";
        errors.weightError =  weightValidator(weight);
        setEditFormError(errors);
        return (errors.firstNameError=="" && errors.lastNameError=="" && errors.weightError=="");
    }
    function toggleEdittingStyle()
    {
        return isEditing ? 'form-control': 'bg-white h4 on';
    }
    function toggleDisable(){
        return isEditing ? "" : "disable";
    }

    function firstNameInput(){
        return (
            <div className="col-5 text-left">
                {makeLabel("firstNameEdit", "First Name")}
            
                {makeInputDiv("text", "firstNameEdit", `firstNameEditInput ${addInvalidStyle(editFormError.firstNameError)} ${toggleEdittingStyle()}`  , firstName ,"First name","First Name" , setFirstName, `${toggleDisable()}`)}
                {makeErrorMessage(editFormError.firstNameError)}
            </div>
        );
    }
    function lastNameInput(){
        return (
            <div className="col-5 text-left">
                {makeLabel("lastNameEdit", "Last Name")}

                {makeInputDiv("text", "lastNameEdit", `lastNameEditInput ${addInvalidStyle(editFormError.lastNameError)} ${toggleEdittingStyle()}` , lastName,"Last name", "Last Name" ,setLastName, `${toggleDisable()}`)}
                {makeErrorMessage(editFormError.lastNameError)}
             </div>
        );
    }
    function weightInput(){
        return (
            <div className="col-5  text-left">
                    {makeLabel("weightEdit", "Weight")}
                    <div className="input-group-prepend"> 
                        {makeInputDiv("text", "editWeightInput", `w-50 ${addInvalidStyle(editFormError.weightError)} ${toggleEdittingStyle()}`, userWeight, "weight", "weight",setUserWeight,`${toggleDisable()}`)}
                        {makeSpan("input-group-text", "lbs")}
                    </div>
                    {makeErrorMessage(editFormError.weightError)}
            </div>
        )
    }
    function makeEditInputs(){
        return (
            <div className="container"> 
                <div className="row pt-5 justify-content-start"> 
                    {firstNameInput()}
                    {lastNameInput()}
                </div>
                <div className="row pt-3 justify-content-start">
                    {weightInput()}
                </div>
            </div>
        );
    }
    function prepareEditProfileJSON()
    {
        const profileChanges ={
            firstName: firstName,
            lastName: lastName,
            weight: userWeight,
            jwtToken: storage.retrieveToken()
        }
        return JSON.stringify(profileChanges);
    }
    function handleEditRes(res){
        if (res.error != 0) {
            setMessage("Error occured!!!");
          } else {
            storage.storeToken(res) // store the token into localStorage
            let _ud = localStorage.getItem("user_data");
            let ud = JSON.parse(_ud);
            let newData = {...ud, firstName: firstName, lastName: lastName, weight: userWeight}
            localStorage.setItem("user_data", JSON.stringify(newData));
            setMessage("");
            setIsEditting(false);
          }
    }
    
    const saveChanges = async (event )=> {
        
        if(!isValidEditInputs(firstName, lastName, userWeight))
            return // stop when there is invalid inputs
        // call API to update user preferences

        /// API function ready, waiting backend to add another API endpoint for this:
        // 
        // const profileChangesJSON = prepareEditProfileJSON();
        // let res = await postJSON(profileChangesJSON, "/api/users/editUser");
        // handleEditRes(res);
        //

        // here we harcoded to test on the frontend, backend would not be updated.
        const res = {
            error: 0,
            jwtToken: "dadwdadwadwd12323"
        }
        
        handleEditRes(res);
    }
    function doLogout(){
        try{
            localStorage.removeItem('token_data');
            localStorage.removeItem('user_data');
        } catch (e){
            console.log(e.toString());
            return;
        }
        window.location.href = "/"; 
    }
    
    function editProfile()
    {
        setIsEditting(true);
    }
    function cancelEdit(){
        //set back to the initial value
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setUserWeight(user.weight);

        // reset the error and mode edit
        setEditFormError({});
        setIsEditting(false);
    }
    function makeProfileButtons(){
        return (
        <div className="buttonDivs fixed-bottom d-flex justify-content-around">
        {makeActionButton("button", "btn btn-danger mt-3 mb-5", () => doLogout(), "Log out", "logoutButton")}
        {!isEditing && makeActionButton("button", "btn btn-primary mt-3 mb-5", () => editProfile(), "Edit Profile", "editProfileButton")}
        {isEditing && makeActionButton("button","btn btn-success mt-3 mb-5", () => saveChanges(), "Save Changes",  "saveChangesButton")}
        {isEditing && makeActionButton("button","btn btn-warning mt-3 mb-5", () => cancelEdit(), "Cancel",  "cancelEditButton")}
        </div>
        );
    }
    return (
        open ?
        <div className="darkBG">
            <div className="centered mediumModal theModal ">
              <div className="modalContent">
                <h1>My Account</h1>
                {makeButton("", "closeBtn",() => {cancelEdit(); close()}, <RiCloseLine/>)}
                {makeEditInputs()}
                {makeProfileButtons()}
                {makeErrorMessage(errorMessage)}
              </div>
            </div>
        </div>
        : null
    );
}

export default MyAccountModal;