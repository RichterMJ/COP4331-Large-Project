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
    const [selectedFoodQuantity, setSelectedFoodQuantity] = useState(1);
    //const [clickSearch, setClickSearch] = useState(false);

    
    function makeRecipeFoodsToAdd(){
        return(
            <div className="d-flex row pl-15 pr-15 ml-10 mr-10">
                <div className="selectedFoodsList col-8">
                hello
                </div>
                <div className="selectedFoodDetails col-4">
                    <div>
                        {selectedFood.description}
                    </div>
                    <div>
                    
                    {makeInputDiv("number", "quanityFoodInput", "w-25 form-control",selectedFoodQuantity, "quanityFoodInput","quantity", setSelectedFoodQuantity)}
                    </div>
                </div>
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