import React from "react";
import TopPanel from "./TopPanel";
import BottomSubPanel from "./BottomSubPanel"
import {TopSubPanel}from "./TopSubPanel"
function RightPanel({user,date,setDateFunc}){
    return(
        <div id="rightPanel">
          <TopPanel userId={user.userID} date={date} setDateFunc={setDateFunc} />
          <TopSubPanel date= {date} userId={user.userId}/>
          <BottomSubPanel date={date}/>
        </div>
    )
}
export default RightPanel;
