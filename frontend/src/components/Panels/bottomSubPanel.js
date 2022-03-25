import React from "react";
function makeNutrientBars(){
}
function makeNutrientCategory (nutrientCat){
  <div className = "nutrientCatHeading">
    {nutrientCat.name}
  </div>
  {makeNutrientBars(nutrientCat)}
}
function makeNutrientBars(nutrientCat){
  nc.nutrientBars?.map(nb => () => makeNutrientBar(nb))
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
