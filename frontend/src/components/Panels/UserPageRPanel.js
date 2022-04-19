import React from "react";
import TopPanel from "./TopPanel";
import BottomSubPanel from "./BottomSubPanel"
import {TopSubPanel}from "./TopSubPanel"
function RightPanel({user,date}){
    return(
        <div id="rightPanel">
          <TopPanel userId={user.userID} date={date} />
      <TopSubPanel date= {date} userId={user.userId}/>
          <BottomSubPanel/>
        </div>
    )
}
export default RightPanel;
