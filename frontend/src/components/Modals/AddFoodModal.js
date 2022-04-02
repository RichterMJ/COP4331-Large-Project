import React, {useState, useRef} from "react";
import {makeButton} from "../divHelpers/divHelpers";
import { RiCloseLine } from "react-icons/ri";
import buildPath from "../path";

let start = 0;
let content = [];

function AddFoodModal({open, close, tc, setTC}){
    const [foodQuery, setFoodQuery] = useState("");
    const [selectedFood, setSelectedFood] = useState("");

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

    //These will be added to separate files
    async function search(foodQuery, scroll){

      //Reset table when new search
      if(!scroll)
        resetTable();

      console.log(start);

      const searchInfo = {
        query: foodQuery,
        pageSize: pageSize,
        start: start,
        jwtToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjQ0YzEwMjNlOTgxYWQ4ZTNmZmIxMjYiLCJmaXJzdE5hbWUiOiJzdGVmIiwibGFzdE5hbWUiOiJoYXJ0IiwiaWF0IjoxNjQ4NjczNzQ5LCJleHAiOjE2NDg2NzU1NDl9.JFdostWfvfKFS0OZIXIAF5bpxJqM6uP-eGB0JisWc4U"
      };
  
      const searchPayload = JSON.stringify(searchInfo);

      console.log(searchPayload);

      start++;
  
      try {
        const response = await fetch(buildPath("api/food/searchByName"), {
          method: "POST",
          body: searchPayload,
          headers: {"Content-Type": "application/json"},
        });
  
        let res = JSON.parse(await response.text());
        console.log(res);
      
        //Wait briefly before adding to table
        setTimeout(function(){
          if (res.error != 0) {
            setTC("An error has occurred. Try Again");
          } else {
            setTC(getContent(res.foods));
          }
        }, 1000);
      } catch (e) {
        console.log(e);
        return;
      }
    }

    function getContent(foods){
      let ret = [];

      for(let i = 0; i < foods.length; i++)
        content.push(createItem(foods[i].description, 100));
      
      for(let food of content)
        ret.push(food);

      return ret;
    }

    function resetTable(){
      setTC("");
      start = 0;
      content = [];
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

    const onScroll = () => {
      if (scrollReference.current) {
        const { top, totalHeight, visibleHeight } = scrollReference.current;
        if (top + visibleHeight === totalHeight) {
          search(foodQuery, true);
        }
      }
    };

    const scrollReference = useRef();

    return (
        open ?
        <div className="darkBG">
            <div className="centered largeModal theModal">
              <div className="modalContent">
                Add Food
                {makeButton("", "closeBtn",() => {close(); resetTable()}, <RiCloseLine/>)}
                <div className="addFoodSearchComponents">
                    {makeTextInput("foodSearch", "foodSearch", "Insert Food", (srch) => setFoodQuery(srch.target.value))}
                    {makeButton("addFoodSearchButton", "btn btn-success btn-block btn-lg text-body",() => search(foodQuery, false), "Search")}
                </div>
                <div className="foodSearchTable" onScroll={onScroll} ref={scrollReference}>
                  {tc}
                </div>
                {makeButton("addFoodButton", "btn btn-success btn-block btn-lg text-body", () => addFood(), "Add")}
              </div>
            </div>
        </div>
        : null
    )
}

export default AddFoodModal;