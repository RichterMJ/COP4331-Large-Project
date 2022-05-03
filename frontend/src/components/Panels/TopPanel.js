import React,{useState} from "react";
import {makeActionButton} from "../divHelpers/divHelpers.js";

function leftDayEvent(curDate,setDayFunc,updateFoods){
    let newDate = new Date(curDate);
    newDate.setDate(curDate.getDate()-1);
    setDayFunc(newDate);
    updateFoods(newDate);
    console.log("heloasjo")
  
}
function rightDayEvent(curDate,setDayFunc,updateFoods){
    let newDate = new Date(curDate);
    newDate.setDate(curDate.getDate()+1);
    setDayFunc(newDate);
    updateFoods(newDate);

}
function LeftButton (props){
    return makeActionButton
    ("button","directionButton",() => leftDayEvent(props.curDate,props.setDayFunc,props.updateFoods),"<","leftButton");

}

function RightButton (props){
    return makeActionButton
    ("button","rightButton directionButton",() => rightDayEvent(props.curDate,props.setDayFunc,props.updateFoods),">","rightButton");
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
    
    return(
        <div id = "topPanel">
          <LeftButton curDate={props.date} setDayFunc={props.setDateFunc} updateFoods={props.updateFoods} />
          <MainInfoBox date={props.date}/>
          <RightButton curDate={props.date} setDayFunc={props.setDateFunc} updateFoods={props.updateFoods} />
        </div>
    )
}
export default TopPanel;
