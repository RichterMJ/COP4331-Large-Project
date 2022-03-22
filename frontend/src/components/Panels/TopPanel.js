import React,{useState} from "react";
import makeActionButton from "../divHelpers/divHelpers.js"

function leftDayEvent(){

}
function rightDayEvent(){

}
function leftButton (){
    return makeActionButton
    ("button","directionButton",leftDayEvent(),"<",leftButton);
}

function rightButton (){
    return makeActionButton
    ("button","directionButton",rightDayEvent(),">","rightButton");
}

function mainInfoBox(date){

    return(
        <div id = "mainInfoBox">
            <div id = "timeHeader">
                Your Day
            </div>
            <div id = "timeSubHeader">
              {date}
            </div>
        </div>
)
}

function TopPanel(){
    const [date,setDate] = useState("March 22nd 2022");

    return(
        <div id = "topPanel">
          {leftButton()}
          {mainInfoBox(date)}
          {rightButton()}
        </div>
    )
}
export default TopPanel;
