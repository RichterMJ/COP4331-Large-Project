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
          {makeActionButton("button","removeFoodButton",editFood(),"&#9998;",id)}
        </div>
    )
}

function FoodElement(key,foodName, foodAmount,foodUnit,foodCalories){

    return(

        <div className = "dayFood" id ={key}>
          <div className ="foodName">
            {foodName}
          </div>
          <div className ="foodAmount">
            {foodAmount}
          </div>
          <div className ="foodUnit">
            {foodUnit}
          </div>
          <div className ="foodCalories">
            {foodCalories}
          </div>
          {makeFoodButtons(4)}
        </div>
    )

}

function FoodList(foods){
    console.log(Object.values(foods));
    return(
        <div id="foodList" key="foodList">
            {Object.values(foods)?.map(({id,name,amount,unit,calories}) => {<FoodElement id= {id}  foodName={name} foodAmount ={amount} foodUnit = {unit} foodCalories ={calories}></FoodElement>)}
        </div>
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
