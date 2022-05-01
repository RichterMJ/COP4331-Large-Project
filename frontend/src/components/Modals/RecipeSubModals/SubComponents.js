import React, {useState} from 'react';
import {makeActionButton, makeButton, makeInputDiv, makeLabel, makeSpan} from "../../divHelpers/divHelpers";
import {addInvalidStyle, makeErrorMessage, weightValidator} from "../../Validators/InputValidator";
import { RiCloseLine } from "react-icons/ri";
import {JSONRequest} from "../../RESTHelpers/JSONRequest";


function SelectedRecipeFoodList({selectedFoodsList, setSelectedFoodsList, setSelectedFood, setEditFoodIndex, setSelectedPortion, setSelectedQuantity}){
    function deleteSelectedFood(foodIndex){
        const newFoodList = [...selectedFoodsList]; // copy to newList
        newFoodList.splice(foodIndex,1);
        setSelectedFoodsList(newFoodList);
    }
    function SelectedFoodBubble({recipeFood, foodIndex}){
        const recipeFoodDetails = `${recipeFood.amountUsed.quantity} ${recipeFood.food.description} (${recipeFood.amountUsed.portion.portionName ?? recipeFood.amountUsed.portion.gramAmount})`;
        return(
            <div className="selectedFoodBuble w-auto h-auto pr-1 bg-gray rounded" onClick={()=>foodBubbleClickedHandler(recipeFood, foodIndex)}>
                {recipeFoodDetails} 
                {makeButton("", "deleteSeletedFoodBtn",() => {deleteSelectedFood(foodIndex)}, <RiCloseLine/>)}
            </div>
        );
    }
    function foodBubbleClickedHandler(recipeFood, index){
        setSelectedFood(recipeFood.food)
        setSelectedPortion(recipeFood.amountUsed.portion);
        setSelectedQuantity(recipeFood.amountUsed.quantity);
        setEditFoodIndex(index);
    }
    function displaySelectedFoodList(){
        return (
            <div className="selectedFoodList">
                <h3>Ingredients</h3>
                {selectedFoodsList.map((recipeFood,index) =>{
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
function AddSelectedFoodToRecipe({setSelectedFoodsList, selectedFood, setSelectedFood, selectedFoodsList, editFoodIndex, setEditFoodIndex,selectedPortion, setSelectedPortion, selectedQuantity, setSelectedQuantity}){
     console.log(editFoodIndex)
    // let defaultPortion;
    // let defaultQuantity;
    // if (selectedRecipeFood.amountUsed){
    //     defaultPortion = selectedRecipeFood.amountUsed.portion;
    //     defaultQuantity = selectedRecipeFood.amountUsed.quantity
    // } else {
    //     defaultPortion = {
    //         portionId: 0,
    //         portionName: '100g',
    //         gramAmount: 100
    //     }
    //     defaultQuantity = 1;
    // }
    const [inputError, setInputError] = useState("");
    
    function addFoodToFoodList(){
        
        if (!isValidRecipeFoodInputs()){
            return;
        }
        const newRecipeFood = {
            food: selectedFood,
            amountUsed: {
                portion: selectedPortion,
                quantity: Number(selectedQuantity)
            }
        }; // build a recipe object as declare in global-types.ts in backend
        const newFoodList = [...selectedFoodsList]; // copy to newList
        if (editFoodIndex >= 0){
            newFoodList.splice(editFoodIndex,1);
            newFoodList.splice(editFoodIndex,0,newRecipeFood);
        }
        else {
            newFoodList.push(newRecipeFood);
        }
        console.log(newFoodList)
        setSelectedFoodsList(newFoodList);
        setEditFoodIndex(-1);
        setSelectedQuantity(1);
        setSelectedPortion({});
        setSelectedFood({});
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
                    if (selectedPortion.portionId == portion.portionId){
                        return <option key={index} value={index} selected>{portion.portionName ?? `${portion.gramAmount}g`}</option>
                    }
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
                    {makeInputDiv("number", "quantityFoodInput", "w-25 form-control", ("fdcId" in selectedFood) ? selectedQuantity : 0, "quanityFoodInput","", setSelectedQuantity, "", 1, ("fdcId" in selectedFood) ? 100000 : 1)}                    
            </div>
        );
    }
    function isValidRecipeFoodInputs(){
        if (selectedQuantity <= 0 || Object.keys(selectedPortion).length == 0 || Object.keys(selectedFood).length == 0){
            setInputError("Invalid input");
            setTimeout(()=>setInputError(""),3000);
            return false;
        }
        setInputError("")
        return true;
    }
    function makeButtons(){
        return(
            <>
                {makeActionButton("button", `btn ${(editFoodIndex < 0) ? 'btn-primary' : 'btn-info'}`, ()=>{addFoodToFoodList()},(editFoodIndex < 0) ? "Add to Recipe" : "Edit Recipe", "addFoodToRecipeBtn")}
            </>
        )
    }
    return (
        <>
                    {displaySelectedFood()}
                    {makePortionSelections()}
                    {makeQuantityInput()}
                    {makeButtons()}
                    {makeErrorMessage(inputError)}
        </>
    );
}
export {SelectedRecipeFoodList, AddSelectedFoodToRecipe}