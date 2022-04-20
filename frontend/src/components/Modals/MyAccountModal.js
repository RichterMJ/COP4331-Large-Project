import React, {useState} from "react";
import {makeActionButton, makeButton, makeInputDiv, makeLabel, makeSpan} from "../divHelpers/divHelpers";
import {displayRepsonseMessage, addInvalidStyle, makeErrorMessage, passwordValidator, weightValidator} from "../Validators/InputValidator";
import { RiCloseLine } from "react-icons/ri";
import JSONRequest from "../RESTHelpers/JSONRequest";


function MyAccountModal({user, open, close}) {
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [userWeight, setUserWeight] = useState(user.weight);
    const [isEditing, setIsEditting] = useState(false);
    const [editFormError, setEditFormError] = useState({
        firstNameError: "",
        lastNameError: "",
        weightError: "",
        oldPasswordError: "",
        newPasswordError: "",
        newPasswordConfirmedError: ""
    });
    const [responseMessage, setResponseMessage] = useState({
        type: '',
        message: ''
    });
    const [isEdittingPassword, setIsEditingtPassword] = useState(false);
    const [oldUserPassword, setOldUserPassword] = useState("password");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirmed, setNewPasswordConfirmed] = useState("");

    const storage = require("../tokenStorage.js");

    function isValidEditInputs(editInputs){
        let errors = {};
        errors.firstNameError = (!editInputs.firstName) ? "Invalid First Name" : "";
        errors.elastNameError = (!editInputs.lastName) ? "Invalid Last Name" : "";
        errors.weightError = weightValidator(editInputs.weight);
        errors.oldPasswordError = passwordValidator(editInputs.oldPassword, false);
        errors.newPasswordError= passwordValidator(editInputs.newPassword, true);
        if ((errors.newPasswordConfirmedError = passwordValidator(editInputs.newPasswordConfirmed, false)) == ""){
            if( editInputs.newPassword != editInputs.newPasswordConfirmed){
              errors.newPasswordConfirmedError = "Passwords not matching";
            }
        }
        setEditFormError(errors);
        let isInvalid = Object.keys(errors).some(key=>{ return errors[key].length != 0});
        return !isInvalid;
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
                {displayRepsonseMessage({type:'error', message:editFormError.firstNameError})}
            </div>
        );
    }
    function lastNameInput(){
        return (
            <div className="col-5 text-left">
                {makeLabel("lastNameEdit", "Last Name")}

                {makeInputDiv("text", "lastNameEdit", `lastNameEditInput ${addInvalidStyle(editFormError.lastNameError)} ${toggleEdittingStyle()}` , lastName,"Last name", "Last Name" ,setLastName, `${toggleDisable()}`)}
                {displayRepsonseMessage({type:'error', message:editFormError.lastNameInput})}
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
                    {displayRepsonseMessage({type:'error', message:editFormError.weightError})}
            </div>
        )
    }
    function emailInput(){
        return (
            <div className="col-5 text-left">
            {makeLabel("emailInput", "Email", "")}
            {makeInputDiv("text","emailInput", "d-block", user.email, "emailEditInput", "email", "", "disabled")}
            </div>
        );
    }
    function makeNewPasswordInputs(){
        return (
            <div className="newPasswordInputs ">
                {makeLabel('newPassword', 'New Password', "")}
                {makeInputDiv("password", "newPassword", `form-control ${addInvalidStyle(editFormError.newPasswordError)}`, newPassword, "newPassword", "new password", setNewPassword)}
                {displayRepsonseMessage({type:'error', message:editFormError.newPasswordError})}
                {makeLabel('newPasswordConfirmed', 'Confirm Password', '')}
                {makeInputDiv("password", "newPasswordConfirmed",`form-control ${addInvalidStyle(editFormError.newPasswordConfirmedError)}`, newPasswordConfirmed, "newPasswordConfirmed", "confirm password", setNewPasswordConfirmed)}
                {displayRepsonseMessage({type:'error', message:editFormError.newPasswordConfirmedError})}
            </div>
        );
    }
    function passwordUpdate(){
        return (
            <div className="col-5 text-left">
                {makeLabel('oldPasswordInput', !isEdittingPassword ? 'Password' : 'Old Password', '')}
                {makeInputDiv("password", "oldPasswordInput", `form-control ${addInvalidStyle(editFormError.oldPasswordError)}`, oldUserPassword, "oldPasswordInput", "old password", setOldUserPassword, (isEdittingPassword) ? '' : 'disabled')}
                {isEdittingPassword && makeNewPasswordInputs()}
                {!isEdittingPassword && makeButton('editPasswordBtn', 'btn btn-primary mt-2', ()=>{setIsEditingtPassword(true); setOldUserPassword("")}, 'Update Password')}
                {isEdittingPassword && makeButton('updatePasswordBtn', 'btn btn-success mt-2', ()=>{updatePassword()}, 'Save')}
            </div>
        );
    }
    function passwordEdit(){
        return (
            passwordUpdate()
        )
    }
    function makeEditInputs(){
        return (
            <div className="container"> 
                <div className="row pt-5 justify-content-start"> 
                    {firstNameInput()}
                    {lastNameInput()}
                </div>
                <div className="userLoginEdit row pt-3 justify-content-start">
                    {emailInput()}
                    {passwordEdit()}
                </div>
                <div className="row pt-3 justify-content-start">
                    {weightInput()}
                </div>
            </div>
        );
    }
    function updatePassword(){
        // call API to update password
        const editInputs = {
            firstName: firstName,
            lastName: lastName,
            weight: userWeight,
            oldPassword: oldUserPassword,
            newPassword: newPassword,
            newPasswordConfirmed: newPasswordConfirmed
        }
        if(!isValidEditInputs(editInputs)){
            console.log("d12")
            return
        }
        setIsEditingtPassword(false);
        setOldUserPassword("password");
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
            setResponseMessage({type: 'error', message:'Error occurred'})
          } else {
            storage.storeToken(res) // store the token into localStorage
            let _ud = localStorage.getItem("user_data");
            let ud = JSON.parse(_ud);
            let newData = {...ud, firstName: firstName, lastName: lastName, weight: userWeight}
            localStorage.setItem("user_data", JSON.stringify(newData));
            setResponseMessage({type: '', message:''});
            setIsEditting(false);
          }
    }
    
    const saveChanges = async (event )=> {
        console.log(firstName + lastName + userWeight)
        const editInputs = {
            firstName: firstName,
            lastName: lastName,
            weight: userWeight,
            oldPassword: oldUserPassword,
            newPassword: newPassword,
            newPasswordConfirmed: newPasswordConfirmed
        }
        if(!isValidEditInputs(editInputs))
            return // stop when there is invalid inputs
        // call API to update user preferences

        /// API function ready, waiting backend to add another API endpoint for this:
        // 
        // const profileChangesJSON = prepareEditProfileJSON();
        // let res = await JSONRequest(profileChangesJSON, "/api/users/editUser");
        // handleEditRes(res);
        //

        // here we harcoded to test on the frontend, backend would not be updated.
        // handleEditRes(res);
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
            <div className="centered myAccountModal theModal ">
              <div className="modalContent">
                <h1>My Account</h1>
                {makeButton("", "closeBtn",() => {cancelEdit(); close()}, <RiCloseLine/>)}
                {makeEditInputs()}
                {makeProfileButtons()}
                {displayRepsonseMessage(responseMessage)}
              </div>
            </div>
        </div>
        : null
    );
}

export default MyAccountModal;