import React,{useState} from "react";
import {makeActionButton} from "../divHelpers/divHelpers.js";

function leftDayEvent(){

}
function rightDayEvent(){

}
function LeftButton (){
    return makeActionButton
    ("button","directionButton",() => leftDayEvent(),"<","leftButton");

}

function RightButton (){
    return makeActionButton
    ("button","directionButton",() => rightDayEvent(),">","rightButton");
}

function MainInfoBox(props){

    return(
        <div id = "mainInfoBox">
            <div id = "timeHeader">
                Your Day
            </div>
            <div id = "timeSubHeader">
              {props.date}
            </div>
        </div>
)
}
function TopPanel(props){
    const [date,setDate] = useState("March 22nd 2022");

    return(
        <div id = "topPanel">
          <LeftButton/>
          <MainInfoBox date={date}/>
          <RightButton/>
        </div>
    )
}
export default TopPanel;
