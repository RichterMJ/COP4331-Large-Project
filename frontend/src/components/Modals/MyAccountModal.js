import React, {useState} from "react";
import {makeActionButton, makeButton, makeInputDiv, makeLabel, makeSpan} from "../divHelpers/divHelpers";
import {displayRepsonseMessage, addInvalidStyle, makeErrorMessage, passwordValidator, weightValidator} from "../Validators/InputValidator";
import { RiCloseLine } from "react-icons/ri";
import {JSONRequest} from "../RESTHelpers/JSONRequest";

const MD5 = require('md5');

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
        let errors = {...editFormError};
        errors.firstNameError = (!editInputs.firstName) ? "Invalid First Name" : "";
        errors.lastNameError = (!editInputs.lastName) ? "Invalid Last Name" : "";
        errors.weightError = weightValidator(editInputs.weight);

        setEditFormError(errors);
        //let isInvalid = Object.keys(errors).some(key=>{ return errors[key].length != 0});
        return (errors.firstNameError=="" && errors.lastNameError=="" && errors.weightError=="");
    }
    function isValidEditPassword(editInputs){
        let errors = {...editFormError}
        errors.oldPasswordError = passwordValidator(editInputs.oldPassword, false);
        errors.newPasswordError= passwordValidator(editInputs.newPassword, true);
        if ((errors.newPasswordConfirmedError = passwordValidator(editInputs.newPasswordConfirmed, false)) == ""){
            if( editInputs.newPassword != editInputs.newPasswordConfirmed){
              errors.newPasswordConfirmedError = "Passwords not matching";
            }
        }
        setEditFormError(errors);
        return (errors.oldPasswordError == "" && errors.newPasswordError =="" && errors.newPasswordConfirmedError=="")
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
            <div className="firstNameInputDiv">
                {makeLabel("firstNameEdit", "First Name")}
            
                {makeInputDiv("text", "firstNameEdit", `firstNameEditInput d-block ${addInvalidStyle(editFormError.firstNameError)} ${toggleEdittingStyle()}`  , firstName ,"First name","First Name" , setFirstName, `${toggleDisable()}`)}
                {displayRepsonseMessage({type:'error', message:editFormError.firstNameError})}
            </div>
        );
    }
    function lastNameInput(){
        return (
            <div className="lastNameInputDiv">
                {makeLabel("lastNameEdit", "Last Name")}

                {makeInputDiv("text", "lastNameEdit", `lastNameEditInput d-block ${addInvalidStyle(editFormError.lastNameError)} ${toggleEdittingStyle()}` , lastName,"Last name", "Last Name" ,setLastName, `${toggleDisable()}`)}
                {displayRepsonseMessage({type:'error', message:editFormError.lastNameError})}
             </div>
        );
    }
    function weightInput(){
        return (
            <div className="weightInputDiv">
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
            <div className="emailInputDiv">
            {makeLabel("emailInput", "Email", "")}
            {makeInputDiv("text","emailInput", "d-block", user.email, "emailEditInput", "email", "", "disabled")}
            </div>
        );
    }
    function makeNewPasswordInputs(){
        return (
            <div className="newPasswordInputs">
                {makeLabel('newPassword', 'New Password', "")}
                {makeInputDiv("password", "newPassword", `form-control ${addInvalidStyle(editFormError.newPasswordError)}`, newPassword, "newPassword", "new password", setNewPassword)}
                {displayRepsonseMessage({type:'error', message:editFormError.newPasswordError})}
                {makeLabel('newPasswordConfirmed', 'Confirm Password', '')}
                {makeInputDiv("password", "newPasswordConfirmed",`form-control ${addInvalidStyle(editFormError.newPasswordConfirmedError)}`, newPasswordConfirmed, "newPasswordConfirmed", "confirm password", setNewPasswordConfirmed)}
                {displayRepsonseMessage({type:'error', message:editFormError.newPasswordConfirmedError})}
            </div>
        );
    }
    function cancelUpdatePassword(){
        setIsEditingtPassword(false);
        setOldUserPassword("password");
        setNewPassword("");
        setNewPasswordConfirmed("");
        setEditFormError({})
    }
    function passwordUpdate(){
        return (
            <div className="updatePasswordInputs d-block pb-5 mb-4 pt-3">
                {makeLabel('oldPasswordInput', !isEdittingPassword ? 'Password' : 'Old Password', '')}
                {makeInputDiv("password", "oldPasswordInput", `form-control ${addInvalidStyle(editFormError.oldPasswordError)}`, oldUserPassword, "oldPasswordInput", "old password", setOldUserPassword, (isEdittingPassword) ? '' : 'disabled')}
                {displayRepsonseMessage({type:'error', message:editFormError.oldPasswordError})}
                {isEdittingPassword && makeNewPasswordInputs()}
                {!isEdittingPassword && makeButton('editPasswordBtn', 'btn btn-primary mt-2', ()=>{setIsEditingtPassword(true); setOldUserPassword("")}, 'Update Password')}
                {isEdittingPassword && makeButton('updatePasswordBtn', 'btn btn-success mt-2', ()=>{updatePassword()}, 'Save')}
                {isEdittingPassword && makeButton('cancelUpdatePasswordBtn', 'btn btn-warning mt-2 ml-2', ()=>{cancelUpdatePassword()},"Cancel")}
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
            <div className="container "> 
                <div className="row justify-content-around " id="editInputsDiv">
                    <div className= "row col-5 text-left leftEditInputs">
                        {firstNameInput()} 
                        {emailInput()} 
                        {weightInput()}
                    </div>
                    <div className="row col-5 text-left rightEditInputs"> 
                        {lastNameInput()}
                        {passwordEdit()}
                    </div>
                </div>
            </div>
        );
    }
    function prepareUpdatePasswordJSON(){
        const updatePasswordJSON = {
            userId: user.userId,
            oldPassword: MD5(oldUserPassword),
            newPassword: MD5(newPassword),
            jwtToken: storage.retrieveToken()
        }
        return JSON.stringify(updatePasswordJSON)
    }
    function resetMessage(){
        setResponseMessage({type: '', message:''})
    }
    function handleUpdatePasswordRes(res){
        if (res.error == 0){
            console.log(res);
            storage.storeToken(res);
                setIsEditingtPassword(false);
                setOldUserPassword("password");
            setResponseMessage({type: 'success', message:'password update successfully'})
            setTimeout(()=>resetMessage(),2000);
        } else if (res.error == 3){
            setResponseMessage({type: 'error', message:'Incorrect password entered'})
        }
        else {
            setResponseMessage({type: 'error', message:'Error occured'})
        }
    }
    async function updatePassword(){
        // call API to update password
        const editPassInputs = {
            oldPassword: oldUserPassword,
            newPassword: newPassword,
            newPasswordConfirmed: newPasswordConfirmed
        }
        if(!isValidEditPassword(editPassInputs)){
            return
        }
        const updatePasswordJSON  = prepareUpdatePasswordJSON();
        let res = await JSONRequest("POST", updatePasswordJSON, 'api/users/editPassword');
        console.log(res)
        handleUpdatePasswordRes(res);
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
            setResponseMessage({type: 'success', message:'Edited successfully'})
            setTimeout(()=>resetMessage(), 2000);
            setIsEditting(false);
          }
    }
    function prepareEditUserJSON(){
        const editUserJSON = {
            userId: user.userId,
            firstname: firstName,
            lastname: lastName,
            weight: Number(userWeight),
            email: user.email,
            jwtToken: storage.retrieveToken()
        }
        return JSON.stringify(editUserJSON)
    }
    async function saveChanges(){
        const editInputs = {
            firstName: firstName,
            lastName: lastName,
            weight: userWeight,
        }
        if(!isValidEditInputs(editInputs))
            return // stop when there is invalid inputs

        const editUserJSON = prepareEditUserJSON();
        let res = await JSONRequest("POST", editUserJSON, "api/users/edit");
        console.log(res)
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
        cancelUpdatePassword();
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
        <div className="buttonDivs d-flex justify-content-around pt-4">
        {makeActionButton("button", "btn btn-danger mt-3 mb-5", () => doLogout(), "Log out", "logoutButton")}
        {!isEditing && makeActionButton("button", "btn btn-primary mt-3 mb-5 ", () => editProfile(), "Edit Profile", "editProfileButton", isEdittingPassword ? "disabled" : "")}
        {isEditing && makeActionButton("button","btn btn-success mt-3 mb-5", () => saveChanges(), "Save Changes",  "saveChangesButton")}
        {isEditing && makeActionButton("button","btn btn-warning mt-3 mb-5", () => cancelEdit(), "Cancel",  "cancelEditButton")}
        </div>
        );
    }
    return (
        open ?
        <div className="darkBG">
            <div className=" myAccountModal ">
              <div className="modalContent ">
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