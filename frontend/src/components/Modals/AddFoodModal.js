import React, {useState, useRef} from "react";
import {makeButton} from "../divHelpers/divHelpers";
import { RiCloseLine } from "react-icons/ri";
import postJSON from "../RESTHelpers/PostHelpers";
import buildPath from "../path"


let start = 0;

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

    function displayTable(res, foods){
      setTimeout(function(){
        if (res.error != 0) {
          setTC("An error has occurred. Try Again");
        } else {
          //Appends the new items to the table
          setTC(<div>{foods} <FoodList foods={res.foods}/> </div>);
          start++;
        }
      }, 1000);
    }

    function FoodList(props){
      return(
        props.foods.map(f=> <Food key={"test"} food={f.description} calories={100}/>)
      )
    }

    //These will be added to separate files
    async function search(scroll){

      let flag = tc;
      //Reset table when new search
      if(!scroll){
        resetTable();
        flag = "";
      }
  
      const searchJSON = makeSearchJSON();

      try {
        let res = postJSON(searchJSON, "api/food/searchByName");

        //For Testing Purposes:
        //let res = {error: 0, foods:[{description:"Apple"}, {description:"Banana"}, {description:"orange"}, {description:"grape"}]};
      
        displayTable(res, flag);
      } catch (e) {
        console.log(e);
        return;
      }
    }

    function resetTable(){
      setTC("");
      start = 0;
    }

    function Food(props){
      return (
          <button className="foodItem" onClick={function(){setSelectedFood(props.food)}} key={props.key}>
          {props.food}
          <br/>
          {props.calories + " calories"}
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