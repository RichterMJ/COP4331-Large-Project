import React, {useState, useEffect} from "react";
import {makeActionButton, makeButton, makeInputDiv, makeLabel, makeSpan} from "../divHelpers/divHelpers";
import {addInvalidStyle, makeErrorMessage, weightValidator} from "../Validators/InputValidator";
import { RiCloseLine } from "react-icons/ri";
import {BiArrowBack} from "react-icons/bi"
import SearchFood from "./SearchFood";
import JSONRequest from "../RESTHelpers/JSONRequest";
import { AddFoodToRecipeFoodList, SelectedRecipeFoodList } from "./AddRecipeModal";
const storage = require("../tokenStorage.js");
 
function EditRecipeModal({ open, close, backToRecipe, tc ,setTC}){
    function editRecipe(){
        // call api to edit
        return null;
    }
    function makeFoodList(){
        return(
            null
        )
    }
    const [errorMessage, setMessage] = useState("");
    return (
        open ?
        <div className="darkBG">
            <div className="centered addRecipeModal theModal ">
              <div className="modalContent">
                {makeButton("", "backBtn bg-white position-fixed bottom-y", ()=> {close(); setTC(""); backToRecipe()}, <BiArrowBack />)}
                <h1>Edit Recipe</h1>
                {makeButton("", "closeBtn",() => {close();  setTC("")}, <RiCloseLine/>)}
                {makeFoodList()}
                {makeActionButton("button", "btn btn-success", () => editRecipe(), "Edit Recipe", "editRecipeBtn" )}
                {makeErrorMessage(errorMessage)}
              </div>
            </div>
        </div>
        : null
    )
}
export default EditRecipeModal;