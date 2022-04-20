import React, {useState, useEffect} from "react";
import {makeActionButton, makeButton, makeInputDiv, makeLabel, makeSpan} from "../../divHelpers/divHelpers";
import {addInvalidStyle, displayRepsonseMessage, makeErrorMessage, weightValidator} from "../../Validators/InputValidator";
import { RiCloseLine } from "react-icons/ri";
import {BiArrowBack} from "react-icons/bi"
import SearchFood from "../SearchFood";
import JSONRequest from "../../RESTHelpers/JSONRequest";
import { SelectedRecipeFoodList, AddSelectedFoodToRecipe} from "./SubComponents";
const storage = require("../../tokenStorage.js");
 
function EditRecipeModal({ recipe, open, close, backToRecipe, tc ,setTC}){
    console.log("edit12323")
    const [responseMessage, setResponseMessage] = useState({
        type: '',
        message: ''
    });
    const [editRecipeName, setEditRecipeName] = useState(recipe.description);
    const [selectedFoodsList, setSelectedFoodsList] = useState(recipe.ingredients);
    const [selectedFood, setSelectedFood] = useState({});
    const [addMoreFoodOpen, setAddMoreFoodOpen] = useState(false);

    function prepareEditRecipeJSON(){
        const newRecipe = {...recipe, description: editRecipeName, descriptions: selectedFoodsList};
        const editRecipeJSON ={
            recipe: newRecipe,
            jwtToken: storage.retrieveToken()
        }
        return JSON.stringify(editRecipeJSON);
    }
    function isValidEditInputs(){
        if (editRecipeName == "" || Object.keys(selectedFoodsList).length ==0){
            setResponseMessage({...responseMessage, type: 'error', message: 'Error. Recipe has no Name or Ingredients'})
            setTimeout(() => setResponseMessage({...responseMessage, message: ''}), 2000);

            return false;
        }
        return true;
    }
    async function editRecipe(){

        if (!isValidEditInputs()){
            return; // empty list detected 
        }
        // call api to edit
        const editRecipeJSON = prepareEditRecipeJSON();
        let res = await JSONRequest("PUT", editRecipeJSON, "api/users/data/recipes");
        console.log(res);
        if (res.error == 0){
            storage.storeToken(res);
            setResponseMessage({...responseMessage, type: 'success', message: 'Successfully Edited'})
            setTimeout(() => setResponseMessage({...responseMessage, message: ''}), 2000);
        }
    }
    function resetTable(){
        setTC("");
    }
    function makeEditRecipeNameInput(){
        return(
            <>
                {makeLabel("editRecipeDescripInput", "Recipe Name", "")}
                {makeInputDiv("text", "editRecipeDescripInput", "form-control", editRecipeName, "editRecipeDescripInput", "Recipe Name", setEditRecipeName)}
            </>
        )
    }
    function displayRecipeEdit(){
        return (
            <div className="row">
                <div className="recipeFoodList col-8 bg-light">
                    <SelectedRecipeFoodList selectedFoodsList={selectedFoodsList} setSelectedFoodsList={setSelectedFoodsList} setSelectedFood={setSelectedFood}/>    
                </div>
                <div className="editRecipeDescriptionInput col-4">
                    {makeEditRecipeNameInput()}
                    <AddSelectedFoodToRecipe setSelectedFoodsList={setSelectedFoodsList} selectedFood={selectedFood} selectedFoodsList={selectedFoodsList} />
                    {makeActionButton("button", "btn-success mt-2", ()=>{addMoreFood()},"Add New Ingredient", "addNewIngredientBtn")}
                </div>
                
            </div>
        );

    }
    function displaySearchFood(){
        return (
            addMoreFoodOpen && <SearchFood tc={tc} setTC={setTC} setSelectedFood={setSelectedFood} resetTable={resetTable} />
        );
    }
    function addMoreFood(){
        setAddMoreFoodOpen(true);
    }
    return (
        open ?
        <div className="darkBG">
            <div className="centered addRecipeModal theModal container">
              <div className="modalContent ">
                {makeButton("", "backBtn bg-white position-fixed bottom-y", ()=> {close(); resetTable(); backToRecipe()}, <BiArrowBack />)}
                <h1>Edit Recipe</h1>
                {makeButton("", "closeBtn",() => {close();  resetTable()}, <RiCloseLine/>)}
                {console.log("reach edit")}
                {displayRecipeEdit()}
                {displaySearchFood()}
                {makeActionButton("button", "btn btn-success", () => editRecipe(), "Edit Recipe", "editRecipeBtn" )}
                {displayRepsonseMessage(responseMessage)}
              </div>
            </div>
        </div>
        : null
    )
}
export default EditRecipeModal;