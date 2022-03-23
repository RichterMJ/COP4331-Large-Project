import React from "react";
import {makeActionButton} from "../divHelpers/divHelpers.js";

function addFoodEvent(){
}
function makeRecipeEvent(){
}
function editUserPrefEvent(){

}
function leftPanelLogoHeader(){
    return(
        <div id = "logoHeader">
            <img id ="mainLogo" src ="./public/assets/thirdlogo.png" alt="logo for gitfit"></img>
            <h1 className ="left-text headerText" id = "title"> gitFit</h1>
         </div>
    )
}
function LeftPanel(){

    return(
        <div id="leftPanel">
          {leftPanelLogoHeader()}
          {makeActionButton("button", "leftPanelButton",addFoodEvent(),
                            "Add Food","addFoodButton")}
          {makeActionButton("button", "leftPanelButton",makeRecipeEvent(),
                            "Make Recipe","makeRecipeButton")}
          {makeActionButton("button", "leftPanelButton",editUserPrefEvent(),
                            "Edit User Preferences","EditUserPrefButton")}
        </div>
    )
}
export default LeftPanel;
