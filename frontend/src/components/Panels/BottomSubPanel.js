/*
import React from "react";
function makeNutrientBars(nutrients)
{
  return (
  <div className = "nutrientBars">
    {nutrients.map((nutrient) => makeNutrientBar(nutrient))}
  </div>
  )
}
function getBarWidth(percentage)
{
  // this is the css value for the nutrition bar
  const MAX_BAR_WIDTH = 80;
  return percentage * (MAX_BAR_WIDTH);

}
function NutrientBar(nutrient)
{
  const [width, setWidth] = useState(getBarWidth(nutrient.percentage));
  return (
    <div style ={{'width':width}} className = "nutrientElement" id = {nutrient.id}> <div className = "nutrientBar"> <div className = "nutrientBarProg"> </div> </div> <div class = "nutrientText"> 21/50g Protein</div> </div>
  )
}
function makeNutrientCategory (nutrientCat)
{
  return(
    <div className = "nutrientCategory" id = {nutrientCat.id}>
      <div className = "nutrientCatHeading">
        {nutrientCat.name}
      </div>
      {NutrientBar(nutrientCat.nutrientBars)}
    </div>
  )
}
function makeNutrientCategories (ncs)
{

}
function BottomSubPanel() {
  const [fitPercentage,setFitPercentage] = useState("50%");
  const [nutrientCategories,setNutrientCategories] = useState([]);

  return(
    <div id= "BSP">
        <div id = "bottomSubPanelHeading"> Summary: {fitPercentage}</div>
        <div id = "bottomSubPanel">
        </div>
    </div>
  )

}
export default BottomSubPanel;
*/
