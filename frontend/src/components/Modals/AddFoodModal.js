import React, {useState} from "react";
import {makeButton} from "../divHelpers/divHelpers";
import { RiCloseLine } from "react-icons/ri";

function AddFoodModal({open, close, tc, setTC}){
    const [foodQuery, setFoodQuery] = useState("");
    const [selectedFood, setSelectedFood] = useState("");

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
    function search(text){
        setTC(getContent);
    }

    //Temporary method for testing
    function getContent(){
      const foods = ['apple', 'banana', 'orange', 'pineapple'];
      const calories = [100, 200, 300, 400];
      let content = [];
      for(let i = 0; i < 4; i++){
        content.push(createItem(foods[i], calories[i]));
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

    console.log('hello');

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