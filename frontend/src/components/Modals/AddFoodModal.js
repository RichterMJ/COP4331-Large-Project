import React, {useState, useRef} from "react";
import {makeButton} from "../divHelpers/divHelpers";
import { RiCloseLine } from "react-icons/ri";
import postJSON from "../RESTHelpers/PostHelpers";
import buildPath from "../path"


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

    function makeSearchJSON(){
      const searchInfo = {
        query: foodQuery,
        pageSize: pageSize,
        start: start,
        jwtToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjQ0YzEwMjNlOTgxYWQ4ZTNmZmIxMjYiLCJmaXJzdE5hbWUiOiJzdGVmIiwibGFzdE5hbWUiOiJoYXJ0IiwiaWF0IjoxNjQ4NjczNzQ5LCJleHAiOjE2NDg2NzU1NDl9.JFdostWfvfKFS0OZIXIAF5bpxJqM6uP-eGB0JisWc4U"
      } 

      return JSON.stringify(searchInfo);
    }

    function displayTable(res){
      console.log(res);
      setTimeout(function(){
        if (res.error != 0) {
          setTC("An error has occurred. Try Again");
        } else {
          setTC(getContent(res.foods));
        }
      }, 1000);
    }

    /*function FoodList(props){
      return(
        props.foods.map(f=> <FoodElement key={f.id} food={f}/>)
      )
    }*/

    //These will be added to separate files
    async function search(foodQuery, scroll){

      //Reset table when new search
      if(!scroll)
        resetTable();
  
      const searchJSON = makeSearchJSON();

      start++;

      console.log(searchJSON);
  
      try {
        let res = postJSON(searchJSON, "api/food/searchByName");
      
        displayTable(res);
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
                {makeButton("addFoodSearchButton", "btn btn-success btn-block btn-lg text-body",() => search(foodQuery, false), "Search")}
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