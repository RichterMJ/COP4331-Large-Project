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
              {getDateString(props.date)}
            </div>
        </div>
)
}
function getDateString(date){
    // these are options for how the date gets displayed
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return new Intl.DateTimeFormat('en-US', options).format(date)

    }

function TopPanel(props){
        let date = props.date;
    return(
        <div id = "topPanel">
          <LeftButton/>
          <MainInfoBox date={date}/>
          <RightButton/>
        </div>
    )
}
export default TopPanel;
