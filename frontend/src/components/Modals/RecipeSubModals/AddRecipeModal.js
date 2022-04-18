import React, {useState, useEffect} from "react";
import {makeActionButton, makeButton, makeInputDiv, makeLabel, makeSpan} from "../../divHelpers/divHelpers";
import {addInvalidStyle, makeErrorMessage, weightValidator} from "../../Validators/InputValidator";
import { RiCloseLine } from "react-icons/ri";
import {BiArrowBack} from "react-icons/bi"
import SearchFood from "../SearchFood";
import JSONRequest from "../../RESTHelpers/JSONRequest";
const storage = require("../../tokenStorage.js");

function AddRecipeModal({user, open, close, tc, setTC, backToRecipe}){
    const [selectedFoodsList, setSelectedFoodsList] = useState([]);
    const [selectedFood, setSelectedFood] = useState({});
    const [recipeDescription, setRecipeDescription] = useState("");
    const [errorMessage, setMessage] = useState("");
    const [queryStart, setQueryStart] = useState(0);
    console.log("add recipe modal detected")
    
    //const [clickSearch, setClickSearch] = useState(false);
    function makeRecipeDescriptionInput(){
        return (
            <div className="recipeDescriptionDiv ">
                {makeLabel("recipeDescriptionInput", "Description", "")}
                {makeInputDiv("text", "recipeDescriptionInput" ,"form-control", recipeDescription, "recipeDescription", "Recipe Description", setRecipeDescription)}
            </div>
        );
    }

    function makeRecipeFoodsToAdd(){
        console.log("hello123")
        return(
            <div className="d-flex row pl-15 pr-15 ml-10 mr-10">
                <div className="selectedFoodsList col-8">
                {makeRecipeDescriptionInput()}
                    <SelectedRecipeFoodList selectedFoodsList={selectedFoodsList} setSelectedFoodsList={setSelectedFoodsList} setSelectedFood={setSelectedFood}/>
                </div>
                <div className="selectedFoodDetails col-4">
                    <AddFoodToRecipeFoodList setSelectedFoodsList={setSelectedFoodsList} selectedFood={selectedFood} selectedFoodsList={selectedFoodsList} />
                </div>
            </div>
        );
    }
    
    function resetTable(){
        setTC("");
        setQueryStart(0);
    }
    function prepareAddRecipeJSON(){
        const recipeJSON ={
            userId: user.userId,
            ingredients: selectedFoodsList,
            description: recipeDescription,
            jwtToken: storage.retrieveToken()
        }
        return JSON.stringify(recipeJSON);
    }
    function handleAddRecipeRes(res){
        if (res.error!=0){
            console.log(res);
            setMessage("Error occured.")
            return;
        }
        console.log(res);
        storage.storeToken(res);
        setMessage("Recipe Added");
        setSelectedFoodsList([]);
        setRecipeDescription("");
        setTimeout(()=>{setMessage("")},3000); // set message back to normal after 3s
    }
    async function addRecipe(){
        if (recipeDescription == "" || Object.keys(selectedFoodsList).length == 0){
            setMessage("Error. Please add ingredients and decription");
            return  // we abort when description is not added and recipe is empty
        }
        const recipeJSON = prepareAddRecipeJSON();
        console.log(recipeJSON);
        let res = await JSONRequest("POST", recipeJSON, "api/users/data/recipes");
        handleAddRecipeRes(res);
    }
    function makeAddRecipeButtons(){
        return (
            <div className="">

            </div>
        );
    }
    return (
        open ?
        <div className="darkBG">
            <div className="centered addRecipeModal theModal ">
              <div className="modalContent">
                {makeButton("", "backBtn bg-white position-fixed bottom-y", ()=> {close(); resetTable(); backToRecipe()}, <BiArrowBack />)}
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
function SelectedRecipeFoodList({selectedFoodsList, setSelectedFoodsList, setSelectedFood}){
    console.log("hello123233")
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
        console.log(selectedFoodsList);
        console.log("hello")
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
function AddFoodToRecipeFoodList({setSelectedFoodsList, selectedFood,selectedFoodsList}){
    const [selectedPortion, setSelectedPortion] = useState({});
    const [selectedFoodQuantity, setSelectedFoodQuantity] = useState(1);
    const [inputError, setInputError] = useState("");
    console.log(selectedFoodsList);
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

                <select id="portionsToSelect"  onChange={(d)=> setSelectedPortion(selectedFood.portions[d.target.value])}>
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
    function isValidRecipeFoodInputs(){
        console.log(selectedFoodQuantity);
        console.log(Object.keys(selectedPortion).length)
        if (selectedFoodQuantity <= 0 || Object.keys(selectedPortion).length == 0){
            setInputError("Invalid input");
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
export {AddRecipeModal, SelectedRecipeFoodList, AddFoodToRecipeFoodList };