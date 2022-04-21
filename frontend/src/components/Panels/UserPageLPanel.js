import React, {useState} from "react";
import {makeActionButton} from "../divHelpers/divHelpers.js";
import AddFoodModal from "../Modals/AddFoodModal";
import MyAccountModal from "../Modals/MyAccountModal.js";
import RecipeModal from "../Modals/RecipeModal.js";

function addFoodEvent(toggleAFM){
    toggleAFM();
}
function displayRecipe(toggleDR){
    toggleDR();
}

function myAccountEvent(toggleEUP){
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

function LeftPanel({user, date}){
    console.log(user);
    const [addFoodOpen, setAddFoodOpen] = useState(false);
    const [myAccountOpen, setMyAccountOpen] = useState(false);
    const [tableContent, setContent] = useState("");
    const [recipeOpen, setRecipeOpen]= useState(false);


    //Makes it so table content in add food is set to blank once opened
    const toggleTC = (content) => setContent(content);
    const toggleAFM = () => setAddFoodOpen(!addFoodOpen);
    const toggleMA = () => setMyAccountOpen(!myAccountOpen);
    const toggleDR = () => setRecipeOpen(!recipeOpen);

 
    return(
        <div id="leftPanel">
          {leftPanelLogoHeader()}
          {makeActionButton("button", "leftPanelButton",() => addFoodEvent(toggleAFM),
                            "Add Food","addFoodButton")}
          {makeActionButton("button", "leftPanelButton",() => myAccountEvent(toggleMA),
                            "My Account","myAccountButton")}
            {makeActionButton("button", "leftPanelButton",() => displayRecipe(toggleDR),
                            "Recipe","recipeButton")}
          <main>
            {<AddFoodModal user={user} open={addFoodOpen} close={toggleAFM} tc={tableContent} setTC={toggleTC}/>}
            {<RecipeModal user={user} open={recipeOpen} close={toggleDR} tc={tableContent} setTC={toggleTC}/>}
            {<MyAccountModal user={user} open={myAccountOpen} close={toggleMA} />}
          </main>
        </div>
    )
}
export default LeftPanel;