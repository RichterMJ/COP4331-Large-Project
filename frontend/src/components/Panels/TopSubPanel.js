import React from "react";
import {FoodSample} from "./PanelTestData";
import {useState} from "react";
import {makeActionButton} from "../divHelpers/divHelpers";

function removeFood(){}
function editFood(){}

function makeFoodButtons(id){
    return(
        <div className= "buttons">
          {makeActionButton("button","removeFoodButton",removeFood(),"x",id)}
          {makeActionButton("button","editFoodButton",editFood(),"edit",id)}
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
          {makeFoodButtons(foodEl.id)}
        </div>
    )

}

function FoodList(props){
    return(
            props.foods.map(f=> <FoodElement key={f.id} food={f}/>)
    )
}


function TopSubPanel(){

    //const [fl,setFl] = useState(FoodSample);
       return(
        <div id = "topSubPanel">
          <FoodList foods ={FoodSample}/>
        </div>
    )
}

export {TopSubPanel};
