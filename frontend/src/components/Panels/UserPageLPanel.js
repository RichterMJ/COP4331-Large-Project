import React, {useState} from "react";
import {makeActionButton} from "../divHelpers/divHelpers.js";
import AddFoodModal from "../Modals/AddFoodModal";
import EditUserPrefModal from "../Modals/EditUserPrefModal.js";


function addFoodEvent(toggleAFM){
    toggleAFM();
}

function makeRecipeEvent(){
}
function editUserPrefEvent(toggleEUP){
    toggleEUP();
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
    const [editUserPrefOpen, setEditUserPrefOpen] = useState(false);
    const [tableContent, setContent] = useState("");
    const _ud = localStorage.getItem("user_data");
    const ud = JSON.parse(_ud);
    const userId = ud.userId;
    const firstName = ud.firstName;
    const lastName = ud.lastName;
    
    //Makes it so table content in add food is set to blank once opened
    const toggleTC = (content) => setContent(content);
    const toggleAFM = () => setAddFoodOpen(!addFoodOpen);
    const toggleEUP = () => setEditUserPrefOpen(!editUserPrefOpen);
 
    return(
        <div id="leftPanel">
          {leftPanelLogoHeader()}
          {makeActionButton("button", "leftPanelButton",() => addFoodEvent(toggleAFM),
                            "Add Food","addFoodButton")}
          {makeActionButton("button", "leftPanelButton",() => makeRecipeEvent(),
                            "Make Recipe","makeRecipeButton")}
          {makeActionButton("button", "leftPanelButton",() => editUserPrefEvent(toggleEUP),
                            "Edit User Preferences","EditUserPrefButton")}
          <main>
            {<AddFoodModal open={addFoodOpen} close={toggleAFM} tc={tableContent} setTC={toggleTC}/>}
            {<EditUserPrefModal firstName={firstName} lastName={lastName} open={editUserPrefOpen} close={toggleEUP} />}
          </main>
        </div>
    )
}
export default LeftPanel;
