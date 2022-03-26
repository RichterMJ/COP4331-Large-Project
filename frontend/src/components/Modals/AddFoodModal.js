import React, {useState} from "react";
import {makeButton} from "../divHelpers/divHelpers";
import { RiCloseLine } from "react-icons/ri";

function AddFoodModal(){
    const [foodQuery, setFoodQuery] = useState("");
    const [isOpen, setIsOpen] = useState("");
    const [selectedFood, setSelectedFood] = useState("");
    const [tableContent, setTableContent] = useState("");

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
        setTableContent(getContent);
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

    return (
        <>
          <div className="darkBG"/>
          <div className="centered">
            <div className="largeModal theModal">
              <div className="modalContent">
                Add Food
                {makeButton("", "closeBtn",() => setIsOpen(false), <RiCloseLine/>)}
                <div className="addFoodSearchComponents">
                    {makeTextInput("foodSearch", "foodSearch", "Insert Food", (srch) => setFoodQuery(srch.target.value))}
                    {makeButton("addFoodSearchButton", "btn btn-success btn-block btn-lg text-body",() => search(foodQuery), "Search")}
                </div>
                <div className="foodSearchTable">
                  {tableContent};
                </div>
                {makeButton("addFoodButton", "btn btn-success btn-block btn-lg text-body", () => addFood(), "Add")}
              </div>
            </div>
          </div>
        </>
      );
}

export default AddFoodModal;