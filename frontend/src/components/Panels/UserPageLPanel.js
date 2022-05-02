import React, {useState} from "react";

import {makeActionButton} from "../divHelpers/divHelpers.js";
import AddFoodModal from "../Modals/AddFoodModal";
import MyAccountModal from "../Modals/MyAccountModal.js";
import RecipeModal from "../Modals/RecipeModal.js";

import Logo from "../Logo"
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
          <Logo/>
            <h1 className ="left-text headerText" id = "title"> gitFit</h1>
         </div>
    )
}

function LeftPanel({user, date,updateFoods, foods}){
    console.log(user);
    const [addFoodOpen, setAddFoodOpen] = useState(false);
    const [myAccountOpen, setMyAccountOpen] = useState(false);
    const [recipeOpen, setRecipeOpen]= useState(false);

    const toggleAFM = () => setAddFoodOpen(!addFoodOpen);
    const toggleMA = () => setMyAccountOpen(!myAccountOpen);
    const toggleDR = () => setRecipeOpen(!recipeOpen);

 
    return(
        <div id="leftPanel">
          {leftPanelLogoHeader()}
          {makeActionButton("button", "leftPanelButton",() => addFoodEvent(toggleAFM),
                            "Add Food","addFoodButton")}
          {makeActionButton("button", "leftPanelButton",() => displayRecipe(toggleDR),
                            "Recipe","recipeButton")}
          {makeActionButton("button", "leftPanelButton",() => myAccountEvent(toggleMA),
                            "My Account","myAccountButton")}

          <main>
            {<AddFoodModal user={user} open={addFoodOpen} date={date} close={toggleAFM} updateFoods ={updateFoods}/>}
            {<RecipeModal user={user} open={recipeOpen} updateFoods={updateFoods} date={date} close={toggleDR}/>}
            {<MyAccountModal user={user} open={myAccountOpen} close={toggleMA} />}
          </main>
        </div>
    )
}
export default LeftPanel;
