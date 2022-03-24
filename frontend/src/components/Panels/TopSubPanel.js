import React from "react";
function removeFood(){}
function editFood(){}

function makeFoodButtons(id){
    return(
        <div className= "buttons">
          {makeActionButton("button","removeFoodButton",removeFood(),"x",id)}
          {makeActionButton("button","removeFoodButton",editFood(),"&#9998;",id)}
        </div>
    )
}

function makeElementFood(food){
    return(
        <div className = "dayFood" id = {food.id}>
          <div className ="foodName">
            {food.name}
          </div>
          <div className ="foodAmount">
            {food.amount}
          </div>
          <div className ="foodUnit">
            {food.unit}
          </div>
          <div className ="foodCalories">
            {food.calories}
          </div>
          {makeFoodButtons(food.id)}
        </div>
    )

}

function foodList(list){
    return(
        list?.map(food=> ()=>makeElementFood(food))
    )
}

function TopSubPanel(){
    const [foodList,setFoodList] = useState([]);
       return(
        <div id = "topSubPanel">
          {foodList(foodList)}
        </div>
    )
}

export default TopSubPanel;
