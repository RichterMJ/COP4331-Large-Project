import React, {useState, useEffect} from "react";
import {makeActionButton, makeButton, makeInputDiv, makeLabel, makeSpan} from "../divHelpers/divHelpers";
import {addInvalidStyle, makeErrorMessage, weightValidator} from "../Validators/InputValidator";
import { RiCloseLine } from "react-icons/ri";
import SearchFood from "./SearchFood";
const storage = require("../tokenStorage.js");

function AddRecipeModal({user, open, close, tc, setTC}){
    const [queryStart, setQueryStart] = useState(0);
    const [selectedFoodsList, setSelectedFoodsList] = useState([]);
    const [selectedFood, setSelectedFood] = useState({});
    const [selectedPortion, setSelectedPortion] = useState({});
    const [selectedFoodQuantity, setSelectedFoodQuantity] = useState(1);
    const [recipeFoodToAdd, setRecipeFoodToAdd] = useState({});
    //const [clickSearch, setClickSearch] = useState(false);
    
   
    function makeRecipeFoodsToAdd(){
        return(
            <div className="d-flex row pl-15 pr-15 ml-10 mr-10">
                <div className="selectedFoodsList col-8">
                {displaySelectedFoodList()}
                </div>
                <div className="selectedFoodDetails col-4">
                    
                    {displaySelectedFood()}
                    {makePortionSelections()}
                    {makeQuantityInput()}
                    {makeActionButton("button", "btn btn-primary", ()=>{addFoodToFoodList()},"Add To Recipe", "addFoodToRecipeBtn")}
                </div>
            </div>
        );
    }
    
    function addFoodToFoodList(){
        
        const newRecipeFood = {
            food: selectedFood,
            amountUsed: {
                portion: selectedPortion,
                quantity: selectedFoodQuantity
            }
        }; // build a recipe object as declare in global-types.ts in backend
        setSelectedFoodsList(selectedFood.push(newRecipeFood));
    }
    function deleteSelectedFood(foodIndex){
        setSelectedFoodsList(selectedFood.splice(foodIndex,1));
    }
    function makeSelectedFoodBubble(foodDescription, foodIndex){
        return(
            <div className="selectedFoodBuble w-auto h-auto pr-1 bg-gray rounded">
                {foodDescription} 
                foodDescription
                {makeButton("", "deleteSeletedFoodBtn",() => {deleteSelectedFood(foodIndex)}, <RiCloseLine/>)}
            </div>
        );
    }
    function displaySelectedFoodList(){
        return (
            <div className="selectedFoodList">
                {selectedFoodsList.map((food,foodIndex) =>{
                    return makeSelectedFoodBubble(food, foodIndex);
                })}
            </div>
        );
    }
    function displaySelectedFood(){
        console.log(selectedFood)
        return (
            <div>
                {selectedFood.description}
            </div>
        );
    }
    function makePortionSelections(){
        return (
            <div>
                <label htmlFor="portionsToSelect">Choose a portion:</label>

                <select id="portionsToSelect" >
                {Object.keys(selectedFood).length !=0 && selectedFood.portions.map(portion =>{
                    return <option key={portion.portionId} value={portion}>{portion.portionName ?? `${portion.gramAmount}g`}</option>
                })}
                </select>
            </div>
        );
    }
    function makeQuantityInput(){
        return (
            <div>
                    {makeLabel("quantityFoodInput", "Enter quantity","")}
                    {makeInputDiv("number", "quantityFoodInput", "w-25 form-control",selectedFoodQuantity, "quanityFoodInput","quantity", setSelectedFoodQuantity)}
            </div>
        );
    }
    function resetTable(){
        setTC("");
        setQueryStart(0);
    }
    function addRecipe(){
        return null;
    }
    return (
        open ?
        <div className="darkBG">
            <div className="centered addRecipeModal theModal ">
              <div className="modalContent">
                <h1>Add Recipe</h1>
                {makeButton("", "closeBtn",() => {close(); resetTable()}, <RiCloseLine/>)}
                <SearchFood tc={tc} setTC={setTC} setSelectedFood={setSelectedFood} resetTable={resetTable} queryStart={queryStart} setQueryStart={setQueryStart} />
                {makeRecipeFoodsToAdd()}
                {makeActionButton("button", "btn btn-success", () => addRecipe(), "Add Recipe", "addRecipeBtn" )}
              </div>
            </div>
        </div>
        : null
    );
}

export default AddRecipeModal;