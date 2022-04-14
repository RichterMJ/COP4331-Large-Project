import React from "react";
import TopPanel from "./TopPanel";
import BottomSubPanel from "./BottomSubPanel"
import {TopSubPanel}from "./TopSubPanel"
function RightPanel({user}){
    return(
        <div id="rightPanel">
          <TopPanel userId={user.userID} />
          <TopSubPanel/>
          <BottomSubPanel/>
        </div>
    )
}
export default RightPanel;
