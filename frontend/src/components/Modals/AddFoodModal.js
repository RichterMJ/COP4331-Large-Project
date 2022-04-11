import React, {useState, useEffect} from "react";
import {makeButton} from "../divHelpers/divHelpers";
import { RiCloseLine } from "react-icons/ri";

import SearchFood from "./SearchFood";


function AddFoodModal({user, open, close, tc, setTC}){
   
    const [selectedFood, setSelectedFood] = useState({});
    const [queryStart, setQueryStart] = useState(0);

    function resetTable(){
      setTC("");
      setQueryStart(0);
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

    function AddFoodButton(){
      return (
              <div className="fixed-bottom pd-3">
                {makeButton("addFoodButton", "btn btn-success btn-block btn-lg text-body mb-4", () => addFood(), "Add")}
              </div>
            )
    }
    return (
        open ?
        <div className="darkBG">
            <div className="centered largeModal theModal">
              <div className="modalContent">
                <ModalHeader/>
                <SearchFood tc={tc} setTC={setTC} setSelectedFood={setSelectedFood} resetTable={resetTable} queryStart={queryStart} setQueryStart={setQueryStart}/>
                <AddFoodButton/>
              </div>
            </div>
        </div>
        : null
    )
}

export default AddFoodModal;