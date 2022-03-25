import React, {useState} from "react";
import {makeButton} from "../divHelpers/divHelpers";
import { RiCloseLine } from "react-icons/ri";

function AddFoodModal(){
    const [foodQuery, setFoodQuery] = useState("");
    const [isOpen, setIsOpen] = useState("");
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

    }

    function addFood(){

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

                </div>
                {makeButton("addFoodButton", "btn btn-success btn-block btn-lg text-body", addFood(), "Add")}
              </div>
            </div>
          </div>
        </>
      );
}

export default AddFoodModal;