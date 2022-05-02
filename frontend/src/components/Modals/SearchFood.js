import React, { useState, useRef } from 'react';
import {JSONRequest} from "../RESTHelpers/JSONRequest";
import {makeButton} from "../divHelpers/divHelpers";
import {CircleSpinner} from "react-spinners-kit";


const storage = require("../tokenStorage.js");

function SearchFood({setSelectedFood, setSelectedPortion, resetTable}){
    const [foodQuery, setFoodQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [queryStart, setQueryStart] = useState(0);
    const [tableFoods, setTableFoods] = useState([]);

    let startFlag = false;
    
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

    function makeNameSearchJSON(){
      console.log(foodQuery);
      const searchInfo = {
        query: foodQuery,
        pageSize: pageSize,
        start: (startFlag) ? 0 : queryStart,
        jwtToken: storage.retrieveToken()
      } 

      return JSON.stringify(searchInfo);
    }

    function makeIDSearchJSON(id){
      const searchInfo = {
        fdcId: Number(id),
        jwtToken: storage.retrieveToken()
      }

      //console.log(searchInfo);
      return JSON.stringify(searchInfo);
    }

    function displayTable(foods){
        if (foods.length != 0) {
          const displayedFoods = (!startFlag) ? [...tableFoods] : [];
          for(let f of FoodList(foods))
            displayedFoods.push(f);

          setTableFoods(displayedFoods);
          setQueryStart((startFlag) ? 1 : queryStart + 1)
        }
    }

    async function convertWithID(res){
      let newFoods = [];

      try {
        const promises = res.foods
                            .map(food => makeIDSearchJSON(food.fdcId))
                            .map(searchIDJSON => JSONRequest('POST', searchIDJSON, 'api/food/searchById'));

        newFoods = await Promise.all(promises);
      } catch (e) {
        console.log(e);
        return;
      }

      displayTable(newFoods.filter(res => res.error === 0));
    }

    function FoodList(foods){
      return(
        foods.map(f=> <Food key={f.food.fdcId} food={f.food}/>)
      )
    }

    //These will be added to separate files
    async function search(scroll){

      startFlag = false;
      //Reset table when new search
      if(!scroll){
        resetTable();
        startFlag = true;
        setTableFoods([]);
      }

      const searchJSON = makeNameSearchJSON();
      console.log(searchJSON);
      try {
        setIsLoading(true);
        let res = await JSONRequest("POST", searchJSON, "api/food/searchByName");
        console.log(res);
        await convertWithID(res);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        return;
      }
    }

    function Food(props){
      return (
          <button className="foodItem" onClick={function(){setSelectedFood(props.food); setSelectedPortion(props.food.portions[0]);}}>
            {props.food.description}
          </button>
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
                  <div>                  
                    {tableFoods}
                  </div>
                </div>    
            )
    }

    const onScroll = () => {
      if (scrollReference.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollReference.current;
        if (scrollTop + clientHeight >= scrollHeight) {
          search(true);
        }
      }
    };

    const scrollReference = useRef();

    function loadingAnimation(){
        return (
            <div className = "d-flex justify-content-center"><CircleSpinner size={30} color="#686769" loading={isLoading} /></div>
        )
    }
    function LoadTable(){
        return (
            (isLoading && tableFoods.length == 0)
            ? 
            loadingAnimation()
            :
            FoodSearchTable()
        );
    }

    return (
        <>
            {FoodSearchComponents()}
            {LoadTable()}
            {(isLoading && tableFoods.length != 0) && loadingAnimation()}
        </>
    )
}
export default SearchFood;