import React, {useState} from "react";
import {makeButton} from "../divHelpers/divHelpers";
import { RiCloseLine } from "react-icons/ri";
import buildPath from "../path";

function AddFoodModal({open, close, tc, setTC}){
    const [foodQuery, setFoodQuery] = useState("");
    const [selectedFood, setSelectedFood] = useState("");

    let start = 0;
    const pageSize = 10;
    let lastQuery;

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

    //These will be added to separate files
    async function search(foodQuery){

      //Reset table when new search
      if(foodQuery != lastQuery){
        setTC("");
        start = 0;
        lastQuery = foodQuery;
      }

      const searchInfo = {
        query: foodQuery,
        pageSize: pageSize,
        start: start
      };
  
      const searchPayload = JSON.stringify(searchInfo);
  
      try {
        const response = await fetch(buildPath("api/food/searchByName"), {
          method: "POST",
          body: searchPayload,
          headers: {"Content-Type": "application/json"},
        });
  
        let res = JSON.parse(await response.text());
        console.log(res);
      
        if (res.error != 0) {
          setTC("An error has occurred. Try Again");
        } else {
          start++;
          setTC(getContent(res.foods));
        }
      } catch (e) {
        console.log(e);
        return;
      }
    }

    function getContent(foods){
      let content = [];
      for(let i = 0; i < foods.length; i++){
        content.push(createItem(foods[i].description, 100));
      }
      return content;
    }

    function createItem(food, calories){
      return (
          <button className="foodItem" onClick={function(){setSelectedFood(food)}}>
          {food}
          <br/>
          {calories + " calories"}
          <br/>
          </button>
      )
    }

    function addFood(){
      console.log(selectedFood);
    }

    return (
        open ?
        <div className="darkBG">
            <div className="centered largeModal theModal">
              <div className="modalContent">
                Add Food
                {makeButton("", "closeBtn",() => {close(); setTC("")}, <RiCloseLine/>)}
                <div className="addFoodSearchComponents">
                    {makeTextInput("foodSearch", "foodSearch", "Insert Food", (srch) => setFoodQuery(srch.target.value))}
                    {makeButton("addFoodSearchButton", "btn btn-success btn-block btn-lg text-body",() => search(foodQuery), "Search")}
                </div>
                <div className="foodSearchTable">
                  {tc};
                </div>
                {makeButton("addFoodButton", "btn btn-success btn-block btn-lg text-body", () => addFood(), "Add")}
              </div>
            </div>
        </div>
        : null
    );
}

export default AddFoodModal;