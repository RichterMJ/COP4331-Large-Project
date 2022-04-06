import React from "react";
import TopPanel from "./TopPanel";
import BottomSubPanel from "./BottomSubPanel"
import {TopSubPanel}from "./TopSubPanel"
function RightPanel(props){

    return(
        <div id="rightPanel">
          <TopPanel userId={props.user.userID} />
          <TopSubPanel/>
          <BottomSubPanel/>
        </div>
    )
}
export default RightPanel;
