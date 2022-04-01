import React, {useState} from "react";
let nutrientTestArray = [
    {
        name:"Carbohydrates",
        actualAmount:50,
        totalAmount:100,
        nutrientId:123,
        unit:"G"
    },
    {
        name:"Protein",
        actualAmount:50,
        totalAmount:100,
        nutrientId:123,
        unit:"G"
    },
    {
        name:"Fat",
        actualAmount:50,
        totalAmount:100,
        nutrientId:123,
        unit:"G"
    },
    {
        name:"Saturated Fat",
        actualAmount:50,
        totalAmount:100,
        nutrientId:123,
        unit:"G"
    }

    ];
let nutrientsTestArray = [
    nutrientTestArray
]
let nutrientCatTest = {
    name:"Macros",
    id:50,
    nutrients:nutrientsTestArray

}
function NutrientBars(props)
{
  return (
    <div className = "nutrientBars">
      {props.nutrients.map((nutrient) => <NutrientBar nutrient={nutrient}/>)}
    </div>
  )
}
function getBarWidth(n)
{
  // this is the css value for the nutrition bar
  const MAX_BAR_WIDTH = 80;
  return (n.actualAmount/n.totalAmount) * (MAX_BAR_WIDTH);

}
function NutrientBar(props)
{
    function getNutrientAmountString(n){
        return n.actualAmount + "/"+n.totalAmount+" " +n.unit+" "+ n.name;
    }
    let curNutrient = props.nutrient;

  const [width, setWidth] = useState(getBarWidth(curNutrient));

  return (
    <div  className = "nutrientElement" id =
        {curNutrient.id}> <div className = "nutrientBar"> <div className = "nutrientBarProg" style ={{'width':width.toString()}}> </div> </div> <div class = "nutrientText"> {getNutrientAmountString(curNutrient)}</div> </div>
  )
}
function NutrientCategory (props){
    let nutrientCat = props.nutrientCat;
  return(
    <div className = "nutrientCategory" id = {nutrientCat.id}>
      <div className = "nutrientCatHeading">
        {nutrientCat.name}
      </div>
      <NutrientBars nutrients={nutrientsTestArray}/>
    </div>
  )
}
function BottomSubPanel() {
  const [fitPercentage,setFitPercentage] = useState("50%");
  const [nutrientCategories,setNutrientCategories] = useState([]);

  return(
    <div id= "BSP">
      <div id = "bottomSubPanelHeading"> Summary: {fitPercentage}</div>
      <div id = "bottomSubPanel">
          <NutrientCategory nutrientCat={nutrientCatTest}/>
      </div>
    </div>
  )

}
export default BottomSubPanel;
