import React, {useState} from 'react';
import {makeActionButton, makeButton, makeInputDiv, makeLabel, makeSpan} from "../../divHelpers/divHelpers";
import {addInvalidStyle, makeErrorMessage, weightValidator} from "../../Validators/InputValidator";
import { RiCloseLine } from "react-icons/ri";
import JSONRequest from "../../RESTHelpers/JSONRequest";


function SelectedRecipeFoodList({selectedFoodsList, setSelectedFoodsList, setSelectedFood}){
    function deleteSelectedFood(foodIndex){
        const newFoodList = [...selectedFoodsList]; // copy to newList
        newFoodList.splice(foodIndex,1);
        setSelectedFoodsList(newFoodList);
    }
    function SelectedFoodBubble({recipeFood, foodIndex}){
        const recipeFoodDetails = `${recipeFood.amountUsed.quantity} ${recipeFood.food.description} (${recipeFood.amountUsed.portion.portionName ?? recipeFood.amountUsed.portion.gramAmount})`;
        return(
            <div className="selectedFoodBuble w-auto h-auto pr-1 bg-gray rounded" onClick={()=>{setSelectedFood(recipeFood.food)}}>
                {recipeFoodDetails} 
                {makeButton("", "deleteSeletedFoodBtn",() => {deleteSelectedFood(foodIndex)}, <RiCloseLine/>)}
            </div>
        );
    }
    function displaySelectedFoodList(){
        return (
            <div className="selectedFoodList">
                <h3>Ingredients</h3>
                {selectedFoodsList.map((recipeFood,index) =>{
                    console.log("12321321321")
                    return <SelectedFoodBubble key={index} recipeFood={recipeFood} foodIndex={index}/>
                })}
            </div>
        );
    }
    return (
        <>
                {displaySelectedFoodList()}
        </>
    );
}
function AddSelectedFoodToRecipe({setSelectedFoodsList, selectedFood,selectedFoodsList}){
    const defaultPortion = {
        portionId: 0,
        portionName: '100g',
        gramAmount: 100
    }
    const [selectedPortion, setSelectedPortion] = useState(defaultPortion);
    const [selectedFoodQuantity, setSelectedFoodQuantity] = useState(1);
    const [inputError, setInputError] = useState("");
    
    function addFoodToFoodList(){
        
        if (!isValidRecipeFoodInputs()){
            return;
        }
        const newRecipeFood = {
            food: selectedFood,
            amountUsed: {
                portion: selectedPortion,
                quantity: Number(selectedFoodQuantity)
            }
        }; // build a recipe object as declare in global-types.ts in backend
        const newFoodList = [...selectedFoodsList]; // copy to newList
        newFoodList.push(newRecipeFood);
        console.log(newFoodList)
        setSelectedFoodsList(newFoodList);
        setInputError("");
    }
    function displaySelectedFood(){
        return (
            <>
                <h4>Food Selected</h4>
                <p className="font-weight-bold">{selectedFood.description}</p>
            </>
        );
    }
    function makePortionSelections(){
        return (
            <div>
                <label htmlFor="portionsToSelect">Choose a portion:</label>

                <select id="portionsToSelect" onChange={(d)=> setSelectedPortion(selectedFood.portions[d.target.value])}>
                {Object.keys(selectedFood).length !=0 && selectedFood.portions.map((portion, index) =>{
                    if (!index) {console.log(portion)}
                    console.log(portion);
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
    function isValidRecipeFoodInputs(){
        console.log(selectedFoodQuantity);
        console.log(Object.keys(selectedPortion).length)
        if (selectedFoodQuantity <= 0 || Object.keys(selectedPortion).length == 0){
            setInputError("Invalid input");
            setTimeout(()=>setInputError(""),3000);
            return false;
        }
        setInputError("")
        return true;
    }
    return (
        <>
                    {displaySelectedFood()}
                    {makePortionSelections()}
                    {makeQuantityInput()}
                    {makeActionButton("button", "btn btn-primary", ()=>{addFoodToFoodList()},"Add To Recipe", "addFoodToRecipeBtn")}
                    {makeErrorMessage(inputError)}
        </>
    );
}
export {SelectedRecipeFoodList, AddSelectedFoodToRecipe}