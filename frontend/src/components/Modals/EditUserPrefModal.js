import React, {useState} from "react";
import {makeActionButton, makeButton, makeInputDiv, makeLabel, makeSpan} from "../divHelpers/divHelpers";
import { RiCloseLine } from "react-icons/ri";

function EditUserPrefModal({firstName, lastName, open, close}) {

    function makeEditInputs(){
        return (
            <div className="container">
            <div className="row pt-5 justify-content-start">
                <div className="col-5 text-left">
                {makeLabel("firstNameEdit", "First Name")}
                {makeInputDiv("text", "firstNameEdit", "form-control",firstName, "firstName", "First Name")}
                </div>

                <div className="col-5 text-left">
                {makeLabel("lastNameEdit", "Last Name")}
                {makeInputDiv("text", "lastNameEdit", "form-control", lastName,"Last name", "Last Name" )}
                </div>
            </div>
            <div className="row pt-3 justify-content-start">
                <div className="col-sm-3 .offset-col-1 text-left">
                    {makeLabel("weightEdit", "Weight")}
                    <div className="input-group-prepend"> 
                        {makeInputDiv("text", "editWeightInput", "form-control", "0", "weight", "weight")}
                        {makeSpan("input-group-text", "lbs")}
                    </div>
                </div>
            </div>
            </div>
        );
    }
    function saveChanges(){
        // call API to update user preferences
        return null;
    }
    return (
        open ?
        <div className="darkBG">
            <div className="centered mediumModal theModal ">
              <div className="modalContent">
                Edit User Preferences
                {makeButton("", "closeBtn",() => {close()}, <RiCloseLine/>)}
                {makeEditInputs()}
                {makeActionButton("button","btn btn-success mt-5", saveChanges(), "Save Changes",  "editUserPredButton")}
              </div>
            </div>
        </div>
        : null
    );
}

export default EditUserPrefModal;