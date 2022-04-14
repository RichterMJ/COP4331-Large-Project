import React, {useState, useEffect} from "react";
import {makeButton, makeLabel, makeInputDiv} from "../divHelpers/divHelpers";
import { RiCloseLine } from "react-icons/ri";
import SearchFood from "./SearchFood";
import JSONRequest from "../RESTHelpers/JSONRequest";


function AddFoodModal({user, open, close, tc, setTC}){
   
    const [selectedFood, setSelectedFood] = useState({});
    const [queryStart, setQueryStart] = useState(0);
    const [selectedFoodQuantity, setSelectedFoodQuantity] = useState(1);
    const [selectedPortion, setSelectedPortion] = useState({});


    function resetTable(){
      setTC("");
      setQueryStart(0);
    }
   
    /*        && (!('foodRecordId' in obj) || isObjectIdString(obj.foodRecordId))
    && 'userId' in obj && isObjectIdString(obj.userId)
    && 'food' in obj && isFood(obj.food)
    && 'amountConsumed' in obj && isAmountConsumed(obj.amountConsumed)
    && 'creationTimestamp' in obj && isAnyDate(obj.creationTimestamp)
    && 'eatenTimestamp' in obj && isAnyDate(obj.eatenTimestamp)
    && 'totalNutrients' in obj && Array.isArray(obj.totalNutrients) && obj.totalNutrients.every(isNutrient)*/

    function makeFoodRecordJSON(){
      const foodData = {
        userId: user.userId,
        food: selectedFood,
        amountConsumed: 2
      }
    }

    function addFood(){
      
    }


    function makeRecipeFoodsToAdd(){
        return(
            <div className="d-flex row pl-15 pr-15 ml-10 mr-10">
                <div className="selectedFoodDetails col-4 addFood">
                    {displaySelectedFood()}
                    {makePortionSelections()}
                    {makeQuantityInput()}
                </div>
            </div>
        );
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
    

    function ModalHeader(){
      return (       
              <div>
                Add Food
                {makeButton("", "closeBtn",() => {close(); resetTable()}, <RiCloseLine/>)}
              </div>         
            )
    }

    function AddFoodButton(){
      return (
              <div className="fixed-bottom pd-3">
                {makeButton("addFoodButton", "btn btn-success btn-block btn-lg text-body mb-4", () => addFood(), "Add")}
              </div>
            )
    }
    return (
        open ?
        <div className="darkBG">
            <div className="centered largeModal theModal">
              <div className="modalContent">
                <ModalHeader/>
                <SearchFood tc={tc} setTC={setTC} setSelectedFood={setSelectedFood} resetTable={resetTable} queryStart={queryStart} setQueryStart={setQueryStart}/>
                {makeRecipeFoodsToAdd()}
                <AddFoodButton/>
              </div>
            </div>
        </div>
        : null
    )
}

export default AddFoodModal;