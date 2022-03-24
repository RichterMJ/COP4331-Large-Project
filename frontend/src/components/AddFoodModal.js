import React, {useState} from "react";
import buildPath from "./path";
import {makeButton, makeH2} from "./divHelpers/divHelpers";

function AddFoodModal(){

    function makeTextInput (id,name,placeholder){
        return(<input
                  className="form-control"
                  type="text"
                  id={id}
                  name={name}
                  placeholder={placeholder}
                />
              )
    }

    return (
        <>
          <div className="darkBG"/>
          <div className="centered">
            <div className="largeModal theModal">
              <div className="modalContent">
                Add Food
                {makeTextInput("foodSearch", "foodSearch", "Insert Food")}
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