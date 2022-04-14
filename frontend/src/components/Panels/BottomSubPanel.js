import React, {useState} from "react";
let nutrientTestArray = [
    {
        name:"Carbohydrates",
        actualAmount:50,
        totalAmount:100,
        ID:123,
        unit:"G"
    },
    {
        name:"Protein",
        actualAmount:50,
        totalAmount:100,
        ID:124,
        unit:"G"
    },
    {
        name:"Fat",
        actualAmount:50,
        totalAmount:100,
        ID:125,
        unit:"G"
    },
    {
        name:"Saturated Fat",
        actualAmount:50,
        totalAmount:100,
        ID:126,
        unit:"G"
    }

    ];
let nutrientsTestArray = [
    nutrientTestArray
]
let nutrientCatTest = {
    name:"Macros",
    ID:50,
    nutrients:nutrientTestArray

}
function NutrientBars(props)
{
  return (
    <div className = "nutrientBars">
      {props.nutrients.map((nutrient) => <NutrientDiv key={nutrient.ID}  nutrient={nutrient}/>)}
    </div>
  )
}
function getBarWidth(n)
{
  // this is the css value for the nutrition bar
  const MAX_BAR_WIDTH = 80;
  return (n.actualAmount/n.totalAmount) * (MAX_BAR_WIDTH);

}
function NutrientStatusBars(props){
  return(
    <div className = "nutrientBar"> <div className = "nutrientBarProg" style ={{'width':props.width.toString()}}> </div> </div>   )

}
function NutrientDiv(props)
{
    function getNutrientAmountString(n){
        return n.actualAmount + "/"+n.totalAmount+" " +n.unit+" "+ n.name;
    }
    let curNutrient = props.nutrient;

  const [width, setWidth] = useState(getBarWidth(curNutrient));

  return (
    <div key ={curNutrient.ID} className = "nutrientElement">
      <NutrientStatusBars width={width}/>
      <div className = "nutrientText"> {getNutrientAmountString(curNutrient)}</div>
    </div>
  )
}
function NutrientCategory (props){
    let nutrientCat = props.nutrientCat;
  return(
    <div className = "nutrientCategory" id = {nutrientCat.id}>
      <div className = "nutrientCatHeading">
        {nutrientCat.name}
      </div>
      <NutrientBars nutrients={nutrientCat.nutrients}/>
    </div>
  )
}
function BottomSubPanel() {
  const [fitPercentage,setFitPercentage] = useState("50%");
  const [nutrientCategories,setNutrientCategories] = useState([]);

  return(
    <div id= "BSP">
      <div id  = "bottomSubPanelHeading"> Summary: {fitPercentage}</div>
      <div id = "bottomSubPanel">
          <NutrientCategory nutrientCat={nutrientCatTest}/>
          <NutrientCategory nutrientCat={nutrientCatTest}/>
          <NutrientCategory nutrientCat={nutrientCatTest}/>
          <NutrientCategory nutrientCat={nutrientCatTest}/>
      </div>
    </div>
  )

}
export default BottomSubPanel;
