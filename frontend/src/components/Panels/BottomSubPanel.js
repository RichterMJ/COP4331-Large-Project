import React, {useState, useEffect} from "react";
import { getDateString } from "../divHelpers/monthGenerator";
import { JSONRequest } from "../RESTHelpers/JSONRequest";
import {categorizeNutrients, addRDIAmount} from "./NutrientsCat";
import {getNutrientSubCategoryPercentage,getAverageNutrientForDay} from ".//AveragePercentage"
const storage = require("../tokenStorage.js");

// let nutrientTestArray = [
//     {
//         name:"Carbohydrates",
//         actualAmount:50,
//         totalAmount:100,
//         ID:123,
//         unit:"G"
//     },
//     {
//         name:"Protein",
//         actualAmount:50,
//         totalAmount:100,
//         ID:124,
//         unit:"G"
//     },
//     {
//         name:"Fat",
//         actualAmount:50,
//         totalAmount:100,
//         ID:125,
//         unit:"G"
//     },
//     {
//         name:"Saturated Fat",
//         actualAmount:50,
//         totalAmount:100,
//         ID:126,
//         unit:"G"
//     }

//     ];
// let nutrientsTestArray = [
//     nutrientTestArray
// ]
// let nutrientCatTest = {
//     name:"Macros",
//     ID:50,
//     nutrients:nutrientTestArray

// }
function NutrientBars(props)
{
  return (
    <div className = "nutrientBars">
      {props.nutrients.map((nutrient) => {
        if(nutrient.RDIValue == 0){
          return null;
        }
        else return <NutrientDiv key={nutrient.nutrientId}  nutrient={nutrient}/>
      })}
    </div>
  )
}
function getBarWidth(n)
{
  // this is the css value for the nutrition bar
  const MAX_BAR_WIDTH = 80;
  let width = (n.value/n.RDIValue) * (MAX_BAR_WIDTH) 
  if (width > MAX_BAR_WIDTH) return MAX_BAR_WIDTH
  else return width ;

}
function NutrientStatusBars(props){
  return(
    <div className = "nutrientBar"> <div className = "nutrientBarProg" style ={{'width':props.width}}> </div> </div>   )

}
function NutrientDiv(props)
{
    function getNutrientAmountString(n){
        return n.value.toFixed(2) + "/"+n.RDIValue+" " +n.unitName+" "+ n.nutrientName;
    }
    let curNutrient = props.nutrient;
    let width = getBarWidth(curNutrient);
  return (
    <div key ={curNutrient.nutrientId} className = "nutrientElement">
      <NutrientStatusBars width={width}/>
      <div className = "nutrientText"> {getNutrientAmountString(curNutrient)}</div>
    </div>
  )
}
function NutrientCategory (props){
    let nutrientCat = props.nutrientCat;

  return(
    <div className = "nutrientCategory">
      <div className = "nutrientCatHeading">
        {`${nutrientCat.name} ${nutrientCat.totalAvgPercentage.toFixed(2)}%`}
      </div>
      <NutrientBars nutrients={nutrientCat.nutrients}/>
    </div>
  )
}

function BottomSubPanel(props) {
  const [fitPercentage,setFitPercentage] = useState(0);
  //const [categorizedRDINutrients, setCategorizedRDINutrients] = useState([]);
  const [nutrientList, setNutrientList] = useState([]);
  const [finalCategorizedNutrient, setFinalCategorizedNutrient] = useState(makeDefaultNutrientDisplay())
  //const [catergorizedNutrients, setCategorizedNutrients] = useState([]);

  
  
  useEffect(()=>{
    const getFoodAverageList = async () =>{
      let res = await getFoodAverage();
    }
    getFoodAverageList();

  },[props.foods])
  useEffect(()=>{

    //finalCategorizedNutrient = makeDefaultNutrientDisplay();
    if (nutrientList.length != 0 && props.RDINutrients.length != 0){
      let finalNutrient  = addRDIAmount(categorizeNutrients(nutrientList),categorizeNutrients(props.RDINutrients));
      addTotalAveragePercentSubNutrient(finalNutrient);
      setFinalCategorizedNutrient(finalNutrient);
    }
    else
    {
      setFinalCategorizedNutrient(makeDefaultNutrientDisplay());
    }
    
  },[nutrientList])
  useEffect(()=>{
    setFitPercentage(getAverageNutrientForDay(finalCategorizedNutrient))
  },[finalCategorizedNutrient])
  function makeDefaultNutrientDisplay(){
    let defaultCategorizedNutrient = {...categorizeNutrients(props.RDINutrients)}
    for( let key in defaultCategorizedNutrient){
      defaultCategorizedNutrient[key].nutrients.map((nutrient, index) =>{
        defaultCategorizedNutrient[key].nutrients[index] = {...defaultCategorizedNutrient[key].nutrients[index], RDIValue: defaultCategorizedNutrient[key].nutrients[index].value, value: 0}
      })
    }
    // Object.keys(defaultCategorizedNutrient).nutrients.map((nutrient, index) =>{
    //   defaultCategorizedNutrient[key].nutrients[index] = {...defaultCategorizedNutrient[key].nutrients[index], RDIValue: defaultCategorizedNutrient[key].nutrients[index].value, value: 0}
    // })
    return defaultCategorizedNutrient;
  }
  function prepareGetFoodAverageJSON(){
    const getFoodAverageJSON = {
      userId: props.userId,
      startDate: getDateString(props.date),
      endDate: getDateString(props.date),
      jwtToken: storage.retrieveToken()
    }
    return JSON.stringify(getFoodAverageJSON);
  }
  function handleGetFoodAverage(res){
    if (res.error == 0){
      storage.storeToken(res);
    }
  }
  async function getFoodAverage(){
    const getFoodAverageJSON = prepareGetFoodAverageJSON();
    console.log(getFoodAverageJSON)
    let res = await JSONRequest("POST", getFoodAverageJSON, "api/food/foodAverage");
    console.log(res);
    handleGetFoodAverage(res);
    setNutrientList(res.averageNutrients);
  }
  function addTotalAveragePercentSubNutrient(catergorizedNutrients){
    for (const subCategory in catergorizedNutrients){
      catergorizedNutrients[subCategory] = {...catergorizedNutrients[subCategory], totalAvgPercentage: getNutrientSubCategoryPercentage(catergorizedNutrients[subCategory])}
    }
  }
  function displayNutrientCategories(){
    
    //let finalCategorizedNutrient;
    //console.log(props.RDINutrients)

    //finalCategorizedNutrient = makeDefaultNutrientDisplay();
    // if (nutrientList.length != 0 && props.RDINutrients.length != 0){

    //   finalCategorizedNutrient= addRDIAmount(categorizeNutrients(nutrientList),categorizeNutrients(props.RDINutrients));
    // }
    // else
    // {
    //   finalCategorizedNutrient = makeDefaultNutrientDisplay();
      
    // }
    //
    addTotalAveragePercentSubNutrient(finalCategorizedNutrient);
    //let dayAverage = getAverageNutrientForDay(finalCategorizedNutrient);
    //console.log(finalCategorizedNutrient);
    //setFitPercentage(15)
    //setFitPercentage(dayAverage);
    return (
      Object.keys(finalCategorizedNutrient).map((key, index) =>{
        return <NutrientCategory key={index} nutrientCat={finalCategorizedNutrient[key]}/>
      })
    );
  }
  return(
    <div id= "BSP">
      <div id  = "bottomSubPanelHeading"> Summary: {`${fitPercentage.toFixed(2)}%`}</div>
      <div id = "bottomSubPanel">
          {displayNutrientCategories()}
      </div>
    </div>
  )

}
export default BottomSubPanel;
