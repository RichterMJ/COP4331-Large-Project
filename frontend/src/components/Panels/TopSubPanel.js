import React from "react";
import {FoodSample} from "./PanelTestData";
import {useState} from "react";
import {makeActionButton} from "../divHelpers/divHelpers";
import JSONRequest from "../RESTHelpers/JSONRequest";

const storage = require("../tokenStorage.js");


function TopSubPanel(props){
    const [fl,setFl] = useState(props.foodList);
    const [selectedFood, setSelectFood] = useState({});
    const [displayedFoods, setDisplayedFoods] = useState(FoodSample);
    
    function makeRemoveFoodJSON(id){
      const removeData = {
        foodRecordId: id,
        jwtToken: storage.retrieveToken()
      }
      return JSON.stringify(removeData);
    }
    
    async function removeFood(index){
      //For testing, this won't work anymore as it has already been deleted
      //What this will do is get the foodrecordid of displayedFoods[index]
      let temp = "625e0b4da53c56d46025d0d4";
    
      const deleteJSON = makeRemoveFoodJSON(temp);
    
      let res = await JSONRequest("DELETE", deleteJSON, "api/users/data/foodRecords");
      //console.log(res.error);

      FoodSample.splice(index,1);
      setDisplayedFoods(FoodSample.slice(0));
    }
    
    function editFood(){}
    
    function makeFoodButtons(id, index){
    
        return(
            <div className= "buttons">
              {makeActionButton("button","removeFoodButton",() => removeFood(index),"x",id)}
              {makeActionButton("button","removeFoodButton",() => editFood(index),"&#9998;",id)}
            </div>
        )
    }
    
    function FoodElement(props){
      let foodEl = props.food;
      return(
    
        <div className = "dayFood" key={foodEl.id} >
          <div className ="foodName">
            {foodEl.name}
          </div>
          <div className ="foodAmount">
            {foodEl.amount}
          </div>
          <div className ="foodUnit">
            {foodEl.unit}
          </div>
          <div className ="foodCalories">
            {foodEl.calories}
          </div>
          {makeFoodButtons(foodEl.id, props.index)}
        </div>
      )
    }
    
    
    function FoodList(props){
      return(
        props.foods.map((f, index) => <FoodElement key={f.id} food={f} index={index}/>)
      )
    }

    return(
      <div id = "topSubPanel">
        <FoodList foods ={displayedFoods}/>
      </div>
    )
}

export {TopSubPanel};
