import React from "react";
import {FoodSample} from "./PanelTestData";
import {useState, useEffect} from "react";
import {makeActionButton} from "../divHelpers/divHelpers";
import {JSONRequest, JSONGETRequest} from "../RESTHelpers/JSONRequest";
import {getDateString} from "../divHelpers/monthGenerator";

const storage = require("../tokenStorage.js");

function TopSubPanel(props){
  console.log(props.date)
    function makeRemoveFoodJSON(id){
      const removeData = {
        foodRecordId: id,
        jwtToken: storage.retrieveToken()
      }
      return JSON.stringify(removeData);
    }
    
    async function removeFood(id, index){    
      const deleteJSON = makeRemoveFoodJSON(id);

      console.log(deleteJSON);
    
      let res = await JSONRequest("DELETE", deleteJSON, "api/users/data/foodRecords");
      
      console.log(res.error);
    
      foods.splice(index,1);
      setFoods(foods.slice(0));
    }
    
    function editFood(){}

    function makeFoodButtons(id, index){
    
        return(
            <div className= "buttons">
              {makeActionButton("button","removeFoodButton",() => removeFood(id, index),"x",id)}
              {makeActionButton("button","removeFoodButton",() => editFood(id, index),"&#9998;",id)}
            </div>
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
            {quantity}
          </div>
          <div className ="foodGrams">
            {portion.gramAmount}
          </div>
          {makeFoodButtons(props.food.foodRecordId, props.index)}
        </div>
      )
    }
    
    
    function FoodList(props){
      return(
        props.foods.map((f, index) => <FoodElement key={f.id} food={f} index={index}/>)
      )
    }

    function makeFoodDayJSON(curDate){
      const dateString = getDateString(curDate);
      const foodReq = {
        userId:props.userId,
        startDate:dateString,
        endDate:dateString,
        jwtToken:storage.retrieveToken()
      }
      return foodReq;
    }

    function makeFoodDayURL(foodReq){
      return "api/users/data/foodRecords/?userId="+foodReq.userId+"&startDate="+foodReq.startDate+"&endDate="+foodReq.endDate+"&jwtToken="+foodReq.jwtToken;
    }

    function handleFDGetRes(res){
      if(res.error!=0){
        console.log("error Happen"+res.error);
        return [];
      }
      console.log(res.foodRecords);
      console.log("no error");
      return res.foodRecords
    }

    
    // this will get the latest version of the person's food day
    async function getFoodDayList(startDate){
      console.log(makeFoodDayURL(makeFoodDayJSON(startDate)));
      let res = await JSONGETRequest(makeFoodDayURL(makeFoodDayJSON(startDate)));
      console.log(res);
      return handleFDGetRes(res);
    }

    const [fl,setFl] = useState(props.foodList);
    let curDate = props.date;
    const [foods,setFoods] = useState([]);
    // gets initial food day data
    useEffect(() =>{
      const getRecords = async () =>{
        let res = await getFoodDayList(curDate);
        setFoods(res);
        console.log("hello");
        console.log(res);
      }
      getRecords();
    },[]);

    console.log(foods);

    return(
      <div id = "topSubPanel">
        <FoodList foods ={foods}/>
      </div>
    )
}

export {TopSubPanel};
