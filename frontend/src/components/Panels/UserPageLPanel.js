import React, {useState} from "react";
import {makeActionButton} from "../divHelpers/divHelpers.js";
import AddFoodModal from "../Modals/AddFoodModal";


function addFoodEvent(setAddFoodOpen){
    setAddFoodOpen(true);
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
    const [addFoodOpen, setAddFoodOpen] = useState(false);

    return(
        <div id="leftPanel">
          {leftPanelLogoHeader()}
          {makeActionButton("button", "leftPanelButton",() => addFoodEvent(setAddFoodOpen),
                            "Add Food","addFoodButton")}
          {makeActionButton("button", "leftPanelButton",() => makeRecipeEvent(),
                            "Make Recipe","makeRecipeButton")}
          {makeActionButton("button", "leftPanelButton",() => editUserPrefEvent(),
                            "Edit User Preferences","EditUserPrefButton")}
          <main>
            {addFoodOpen && <AddFoodModal/>}
          </main>
        </div>
    )
}
export default LeftPanel;
