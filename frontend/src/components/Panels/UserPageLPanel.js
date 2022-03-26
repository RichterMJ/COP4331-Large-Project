import React, {useState} from "react";
import {makeActionButton} from "../divHelpers/divHelpers.js";
import AddFoodModal from "../Modals/AddFoodModal";


function addFoodEvent(toggleAFM){
    toggleAFM();
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
    const [tableContent, setContent] = useState("");

    //Makes it so table content in add food is set to blank once opened
    const toggleTC = (content) => setContent(content);
    const toggleAFM = () => setAddFoodOpen(!addFoodOpen);
 
    return(
        <div id="leftPanel">
          {leftPanelLogoHeader()}
          {makeActionButton("button", "leftPanelButton",() => addFoodEvent(toggleAFM),
                            "Add Food","addFoodButton")}
          {makeActionButton("button", "leftPanelButton",() => makeRecipeEvent(),
                            "Make Recipe","makeRecipeButton")}
          {makeActionButton("button", "leftPanelButton",() => editUserPrefEvent(),
                            "Edit User Preferences","EditUserPrefButton")}
          <main>
            {<AddFoodModal open={addFoodOpen} close={toggleAFM} tc={tableContent} setTC={toggleTC}/>}
          </main>
        </div>
    )
}
export default LeftPanel;
