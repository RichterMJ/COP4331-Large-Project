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
    const [inputError, setInputError] = useState("");
    const [errorMessage, setMessage] = useState("");
    //const [clickSearch, setClickSearch] = useState(false);


    function addFoodToFoodList(){
        
        if (!isValidRecipeFoodInputs()){
            return;
        }
        
        const newRecipeFood = {
            food: selectedFood,
            amountUsed: {
                portion: selectedPortion,
                quantity: selectedFoodQuantity
            }
        }; // build a recipe object as declare in global-types.ts in backend
        const newFoodList = [...selectedFoodsList]; // copy to newList
        newFoodList.push(newRecipeFood);
        console.log(newFoodList)
        setSelectedFoodsList(newFoodList);
    }
    function isValidRecipeFoodInputs(){
        console.log(selectedFoodQuantity);
        if (selectedFoodQuantity <= 0 || Object.keys(selectedPortion) == 0){
            setInputError("Invalid input");
            return false;
        }
        console.log("hello")
        return true;
    }
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
                    {makeErrorMessage(inputError)}
                </div>
            </div>
        );
    }
    function deleteSelectedFood(foodIndex){
        const newFoodList = [...selectedFoodsList]; // copy to newList
        newFoodList.splice(foodIndex,1);
        setSelectedFoodsList(newFoodList);
    }
    function SelectedFoodBubble({recipeFood, foodIndex}){
        const recipeFoodDetails = `${recipeFood.amountUsed.quantity} ${recipeFood.food.description} (${recipeFood.amountUsed.portion.portionName ?? recipeFood.amountUsed.portion.gramAmount})`;
        return(
            <div className="selectedFoodBuble w-auto h-auto pr-1 bg-gray rounded">
                {recipeFoodDetails} 
                {makeButton("", "deleteSeletedFoodBtn",() => {deleteSelectedFood(foodIndex)}, <RiCloseLine/>)}
            </div>
        );
    }
    function displaySelectedFoodList(){
        console.log(selectedFoodsList);
        return (
            <div className="selectedFoodList">
                {selectedFoodsList.map((recipeFood,index) =>{
                    return <SelectedFoodBubble key={index} recipeFood={recipeFood} foodIndex={index}/>
                })}
            </div>
        );
    }
    function displaySelectedFood(){
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

                <select id="portionsToSelect" onChange={(d)=> setSelectedPortion(selectedFood.portions[d.target.value])}>
                {Object.keys(selectedFood).length !=0 && selectedFood.portions.map((portion, index) =>{
                    return <option key={index} value={index}>{portion.portionName ?? `${portion.gramAmount}g`}</option>
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
                {makeErrorMessage(errorMessage)}
              </div>
            </div>
        </div>
        : null
    );
}

export default AddRecipeModal;