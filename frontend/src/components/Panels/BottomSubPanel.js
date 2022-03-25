import React from "react";
function makeNutrientBars(nutrients){
  return (
  <div className = "nutrientBars">
    {nutrients.map(nutrient => () => makeNutrientBar(nutrient));}
  </div>
  )
}
function makeNutrientBar(nutrient){
  d
}
function makeNutrientCategory (nutrientCat){
  return(
    <div className = "nutrientCategory",id = {nutrientCat.name}>
      <div className = "nutrientCatHeading">
        {nutrientCat.name}
      </div>
      {makeNutrientBars(nutrientCat)}
    </div>
  )
}
function makeNutrientBar(nb){

}
function makeNutrientCategories (ncs){

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
