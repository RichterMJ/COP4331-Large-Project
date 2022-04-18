import React from "react";
import {FoodSample} from "./PanelTestData";
import {useState} from "react";
import {makeActionButton} from "../divHelpers/divHelpers";
import {JSONRequest, JSONGETRequest} from "../RESTHelpers/JSONRequest";
const storage = require("../tokenStorage.js");
function removeFood(){}
function editFood(){}
function makeFoodButtons(id){

    return(
        <div className= "buttons">
          {makeActionButton("button","removeFoodButton",() => removeFood(),"x",id)}
          {makeActionButton("button","removeFoodButton",() => editFood(),"&#9998;",id)}
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
function TopSubPanel(props){
  function makeFoodDayRequest(curDate){
    const dateString = getDateString(curDate);
    const foodReq = {
      userId:props.userId,
      startDate:dateString,
      endDate:dateString,
      jwtToken:storage.retrieveToken()
    }

    return JSON.stringify(foodReq);
  }

  function getFoodDayList(startDate){
    let res = await JSONGETRequest(makeFoodDayRequest(startDate),"");
  }
  // this funtion adds leading zeros required by api
  function prepMonth(month){
    if(month.toString().length==1){
      return "0"+month;
    }
    else{
      return month;
    }
  }
  function getDateString(date){
    return date.getFullYear() + "-" + prepMonth(date.getMonth())+ "-" + date.getDate();
  }
  const [fl,setFl] = useState(props.foodList);

  let curDate = props.date;
  const [foods,setFoods] = useState(getFoodDayList(props.date))
  console.log(getDateString(curDate));
  return(
    <div id = "topSubPanel">
      <FoodList foods ={FoodSample}/>
    </div>
  )
}

export {TopSubPanel};
