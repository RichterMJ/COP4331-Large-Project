import React, {useState, useEffect} from "react";
import {makeButton, makeLabel, makeInputDiv} from "../divHelpers/divHelpers";
import { RiCloseLine } from "react-icons/ri";
import SearchFood from "./SearchFood";
import {JSONRequest} from "../RESTHelpers/JSONRequest";
import {getDateString} from "../divHelpers/monthGenerator";

const storage = require("../tokenStorage.js");

function AddFoodModal({user, open, close, date, updateFoods}){
   
    const [selectedFood, setSelectedFood] = useState({});
    const [selectedFoodQuantity, setSelectedFoodQuantity] = useState(1);
    const [selectedPortion, setSelectedPortion] = useState({});

    console.log(date)
    function resetTable(){
      resetPortionSelection();
    }
   
    function makeFoodRecordJSON(){
      const foodData = {
        food: selectedFood,
        userId: user.userId,
        eatenTimestamp: getDateString(date),
        amountConsumed: {portion: selectedPortion, quantity: Number(selectedFoodQuantity)},
        jwtToken: storage.retrieveToken()
      }

      return JSON.stringify(foodData);
    }

    async function addFood(){
      const foodJSON = makeFoodRecordJSON();

      console.log(foodJSON);
      let res = await JSONRequest("POST", foodJSON, "api/users/data/foodRecords");
      console.log(res);
      console.log(res.error);
      resetPortionSelection();
      updateFoods(date);
    }

    function resetPortionSelection(){
      setSelectedFood({});
      setSelectedFoodQuantity(1);
      setSelectedPortion({});
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
                    {makeLabel("quantityFoodInput", "Enter quantity:","")}
                    <div className="shortWidth">
                      {makeInputDiv("number", "quantityFoodInput", "quantitySelect w-25 form-control", ("fdcId" in selectedFood) ? selectedFoodQuantity : 0, "quanityFoodInput","", setSelectedFoodQuantity, "", 1, ("fdcId" in selectedFood) ? 100000 : 1)}
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
                <SearchFood setSelectedFood={setSelectedFood} setSelectedPortion={setSelectedPortion} resetTable={resetTable}/>
                {makeRecipeFoodsToAdd()}
                <AddFoodButton/>
              </div>
            </div>
        </div>
        : null
    )
}

export default AddFoodModal;
