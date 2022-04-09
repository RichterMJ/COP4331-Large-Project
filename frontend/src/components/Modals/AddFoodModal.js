import React, {useState, useRef} from "react";
import {makeButton} from "../divHelpers/divHelpers";
import { RiCloseLine } from "react-icons/ri";
import postJSON from "../RESTHelpers/PostHelpers";
const storage = require("../tokenStorage.js");

function AddFoodModal({user, open, close, tc, setTC}){
    const [foodQuery, setFoodQuery] = useState("");
    const [selectedFood, setSelectedFood] = useState("");
    const [queryStart, setQueryStart] = useState(0);

    const pageSize = 10;

    function makeTextInput (id,name,placeholder, onChange){
        return(<input
                  className="form-control"
                  type="text"
                  id={id}
                  name={name}
                  placeholder={placeholder}
                  onChange={onChange}
                />
              )
    }

    function makeNameSearchJSON(){
      const searchInfo = {
        query: foodQuery,
        pageSize: pageSize,
        start: queryStart,
        jwtToken: storage.retrieveToken()
      } 

      return JSON.stringify(searchInfo);
    }

    function makeIDSearchJSON(id){
      const searchInfo = {
        fdcId: Number(id),
        jwtToken: storage.retrieveToken()
      }

      //console.log(searchInfo);
      return JSON.stringify(searchInfo);
    }

    function displayTable(foods, currentFoods){
        if (foods.length == 0) {
          setTC("This search provided no results");
        } else {
          //Appends the new items to the table
          setTC(<div>{currentFoods} <FoodList foods={foods}/> </div>);
          setQueryStart(queryStart + 1);
          storage.storeToken();
        }
    }

    async function convertWithID(res, currentFoods){
      const foodsToConvert = [];
      for(let food of res.foods){
        const searchIDJSON = makeIDSearchJSON(food.fdcId);

        try {
          let res = await postJSON(searchIDJSON, "api/food/searchById");

          //If there is a problem with one of the items skip it
          if(res.error != 0)
            continue;

          foodsToConvert.push(res);
        } catch (e) {
          console.log(e);
          return;
        }
      }
        console.log(foodsToConvert);
        displayTable(foodsToConvert, currentFoods);
      
    }

    function FoodList(props){
      return(
        props.foods.map(f=> <Food key={"test"} food={f.food.description} portions={portionsToString(f.food.portions)}/>)
      )
    }

    function portionsToString(portions){
      let res = "";
      for(let portion of portions){
        res += portion.portionName;
      }
      return res;
    }

    //These will be added to separate files
    async function search(scroll){

      let flag = tc;
      //Reset table when new search
      if(!scroll){
        resetTable();
        flag = "";
      }
  
      const searchJSON = makeNameSearchJSON();

      try {
        let res = await postJSON(searchJSON, "api/food/searchByName");
        console.log(res);
        await convertWithID(res, flag);
      } catch (e) {
        console.log(e);
        return;
      }
    }

    function resetTable(){
      setTC("");
      setQueryStart(0);
    }

    function Food(props){
      return (
          <button className="foodItem" onClick={function(){setSelectedFood(props.food)}} key={props.key}>
          {props.food}
          <br/>
          {"Portion: " + props.portions}
          <br/>
          </button>
      )
    }

    function addFood(){
      console.log(selectedFood);
    }
    

    function ModalHeader(){
      return (       
              <div>
                Add Food
                {makeButton("", "closeBtn",() => {close(); resetTable()}, <RiCloseLine/>)}
              </div>         
            )
    }

    function FoodSearchComponents(){
      return (
              <div className="addFoodSearchComponents">
                {makeTextInput("foodSearch", "foodSearch", "Insert Food", (srch) => setFoodQuery(srch.target.value))}
                {makeButton("addFoodSearchButton", "btn btn-success btn-block btn-lg text-body",() => search(false), "Search")}
              </div>
            )
    }

    function FoodSearchTable(){
      return (
                <div className="foodSearchTable" onScroll={onScroll} ref={scrollReference}>
                  {tc}
                </div>    
            )
    }

    function AddFoodButton(){
      return (
              <div>
                {makeButton("addFoodButton", "btn btn-success btn-block btn-lg text-body", () => addFood(), "Add")}
              </div>
            )
    }

    const onScroll = () => {
      if (scrollReference.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollReference.current;
        if (scrollTop + clientHeight === scrollHeight) {
          search(true);
        }
      }
    };

    const scrollReference = useRef();

    return (
        open ?
        <div className="darkBG">
            <div className="centered largeModal theModal">
              <div className="modalContent">
                <ModalHeader/>
                {FoodSearchComponents()}
                {FoodSearchTable()}
                <AddFoodButton/>
              </div>
            </div>
        </div>
        : null
    )
}

export default AddFoodModal;