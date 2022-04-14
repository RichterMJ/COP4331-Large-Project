import React, {useState, useEffect} from "react";
import {makeButton, makeLabel, makeInputDiv} from "../divHelpers/divHelpers";
import { RiCloseLine } from "react-icons/ri";
import SearchFood from "./SearchFood";
import JSONRequest from "../RESTHelpers/JSONRequest";


function AddFoodModal({user, open, close, tc, setTC}){
   
    const [selectedFood, setSelectedFood] = useState({});
    const [queryStart, setQueryStart] = useState(0);
    const [selectedFoodQuantity, setSelectedFoodQuantity] = useState(0);
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
      setSelectedFood({});
      setSelectedFoodQuantity(0);
    }


    function makeRecipeFoodsToAdd(){
        return(
            <div className="portionSelection fixed-bottom pd-3">
                {makePortionSelections()}
                <div className="selectQuantity">
                  {makeQuantityInput()}
                </div>
            </div>
        );
    }

    function makePortionSelections(){
        return (
            <div>
                <div>
                  <label htmlFor="portionsToSelect">Choose a portion:</label>
                </div>

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
                    {makeLabel("quantityFoodInput", "Enter quantity:","")}
                    <div className="shortWidth">
                      {makeInputDiv("number", "quantityFoodInput", "quantitySelect w-25 form-control",selectedFoodQuantity, "quanityFoodInput","quantity", setSelectedFoodQuantity)}
                    </div>                    
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