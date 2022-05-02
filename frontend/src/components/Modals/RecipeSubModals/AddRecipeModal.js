import React, {useState, useEffect} from "react";
import {makeActionButton, makeButton, makeInputDiv, makeLabel, makeSpan} from "../../divHelpers/divHelpers";
import {addInvalidStyle, displayRepsonseMessage, makeErrorMessage, weightValidator} from "../../Validators/InputValidator";
import { RiCloseLine } from "react-icons/ri";
import {BiArrowBack} from "react-icons/bi"
import SearchFood from "../SearchFood";
import {JSONRequest} from "../../RESTHelpers/JSONRequest";
import { AddSelectedFoodToRecipe, SelectedRecipeFoodList } from "./SubComponents";
const storage = require("../../tokenStorage.js");

function AddRecipeModal({user, open, close, backToRecipe}){
    
    const [selectedFoodsList, setSelectedFoodsList] = useState([]);
    const [selectedFood, setSelectedFood] = useState({});
    const [recipeDescription, setRecipeDescription] = useState("");
    const [responseMessage, setResponseMessage] = useState({
        type: '',
        message: ''
    });
    const [editFoodIndex, setEditFoodIndex] = useState(-1);
    const [selectedPortion, setSelectedPortion] = useState({})
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    
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
        return(
            <div className="d-flex row pl-15 pr-15 ml-10 mr-10">
                <div className="selectedFoodsList col-8">
                {makeRecipeDescriptionInput()}
                <SelectedRecipeFoodList selectedFoodsList={selectedFoodsList} setSelectedFoodsList={setSelectedFoodsList} setSelectedFood={setSelectedFood} setEditFoodIndex={setEditFoodIndex} setSelectedPortion={setSelectedPortion} setSelectedQuantity={setSelectedQuantity}/>    
                </div>
                <div className="selectedFoodDetails col-4">
                <AddSelectedFoodToRecipe setSelectedFoodsList={setSelectedFoodsList} selectedFood={selectedFood} selectedFoodsList={selectedFoodsList} setEditFoodIndex={setEditFoodIndex} editFoodIndex={editFoodIndex} selectedPortion={selectedPortion} selectedQuantity={selectedQuantity} setSelectedPortion={setSelectedPortion} setSelectedQuantity={setSelectedQuantity} />
                </div>
            </div>
        );
    }
    
    function resetTable(){
    }
    function prepareAddRecipeJSON(){
        const recipeJSON ={
            userId: user.userId,
            ingredients: selectedFoodsList,
            description: recipeDescription,
            jwtToken: storage.retrieveToken()
        }
        console.log(recipeJSON);
        return JSON.stringify(recipeJSON);
    }
    function handleAddRecipeRes(res){
        if (res.error!=0){
            setResponseMessage({...responseMessage, type: 'error', message: 'Error occured'});
            setTimeout(()=>{setResponseMessage({...responseMessage, message:''})},2000); // set message back to normal after 3s
            return;
        }
        storage.storeToken(res);
        setResponseMessage({...responseMessage, type: 'success', message: 'Recipe Added'});
        setSelectedFoodsList([]);
        setRecipeDescription("");
        setTimeout(()=>{setResponseMessage({...responseMessage, message:''})},2000); // set message back to normal after 3s
    }
    async function addRecipe(){
        if (recipeDescription == "" || Object.keys(selectedFoodsList).length == 0){
            setResponseMessage({...responseMessage, type: 'error', message: 'Error. Please add ingredients and decription'});
            setTimeout(()=>{setResponseMessage({...responseMessage, message:''})},2000);
            return  // we abort when description is not added and recipe is empty
        }
        const recipeJSON = prepareAddRecipeJSON();
        console.log(recipeJSON);
        let res = await JSONRequest("POST", recipeJSON, "api/users/data/recipes");
        console.log(res)
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
            <div className="centered largeModal addRecipeModal theModal ">
              <div className="modalContent">
                {makeButton("", "backBtn bg-white position-fixed bottom-y", ()=> {close(); resetTable(); backToRecipe()}, <BiArrowBack />)}
                <h1>Add Recipe</h1>
                {makeButton("", "closeBtn",() => {close(); resetTable()}, <RiCloseLine/>)}
                <SearchFood setSelectedFood={setSelectedFood} setSelectedPortion={setSelectedPortion} resetTable={resetTable} />
                {makeRecipeFoodsToAdd()}
                {makeActionButton("button", "btn btn-success", () => addRecipe(), "Add Recipe", "addRecipeBtn" )}
                {displayRepsonseMessage(responseMessage)}
              </div>
            </div>
        </div>
        : null
    );
}

export default AddRecipeModal;