import React, {useState} from "react";
import buildPath from "./path";
import {makeButton} from "./divHelpers/divHelpers";

function AddFoodModal(){
    const [foodQuery, setFoodQuery] = useState("");

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

    function search(text){
        console.log(text);
    }

    return (
        <>
          <div className="darkBG"/>
          <div className="centered">
            <div className="largeModal theModal">
              <div className="modalContent">
                Add Food
                <div className="addFoodSearchComponents">
                    {makeTextInput("foodSearch", "foodSearch", "Insert Food", (srch) => setFoodQuery(srch.target.value))}
                    {makeButton("addFoodSearchButton", "btn btn-success btn-block btn-lg text-body",() => search(foodQuery), "Search")}
                </div>
              </div>
              <div className="modalActions">
                <div className="actionsContainer">
                </div>
              </div>
            </div>
          </div>
        </>
      );
}

export default AddFoodModal;