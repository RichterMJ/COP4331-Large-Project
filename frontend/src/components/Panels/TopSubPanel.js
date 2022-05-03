import React from "react";
import {FoodSample} from "./PanelTestData";
import {useState, useEffect} from "react";
import {makeActionButton} from "../divHelpers/divHelpers";
import {JSONRequest, JSONGETRequest} from "../RESTHelpers/JSONRequest";
import {getDateString} from "../divHelpers/monthGenerator";

const storage = require("../tokenStorage.js");

function TopSubPanel(props){
    function makeRemoveFoodJSON(id){
      const removeData = {
        foodRecordId: id,
        jwtToken: storage.retrieveToken()
      }
      return JSON.stringify(removeData);
    }
 function makeFoodButtons(id, index){

        return(
            <div className= "buttons">
              {makeActionButton("button","removeFoodButton",() => removeFood(id, index),"x",id)}
            </div>
        )
    }




    async function removeFood(id, index){
      const deleteJSON = makeRemoveFoodJSON(id);

      console.log(deleteJSON);

      let res = await JSONRequest("DELETE", deleteJSON, "api/users/data/foodRecords");
      props.updateFoods(props.date);

    }


    function FoodList(props){
      return(
        props.foods.map((f, index) => <FoodElement key={index} food={f} index={index}/>)
      )
    }
  function FoodElement(props){
      let foodEl = props.food.food;
      let portion = props.food.amountConsumed.portion;
      let quantity = props.food.amountConsumed.quantity;
      console.log(portion);
      return(

        <div className = "dayFood" key={foodEl.id} >
          <div className ="foodName">
            {foodEl.description}
          </div>
          <div className ="foodAmount">
            {portion.portionName}
          </div>
          <div className ="foodUnit">
            {quantity} Serving
          </div>
          {makeFoodButtons(props.food.foodRecordId, props.index)}
        </div>
      )
    }
    return(
      <div id = "topSubPanel">
        <div className = "foodList">
        <FoodList foods ={props.foods}/>
        </div>
      </div>
    )
}

export {TopSubPanel};
