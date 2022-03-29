import React from "react";
import TopPanel from "./TopPanel";
import BottomSubPanel from "./BottomSubPanel"
import {TopSubPanel}from "./TopSubPanel"
function RightPanel(){
    return(
        <div id="rightPanel">
            <TopPanel/>
            <TopSubPanel/>
        </div>
    )
}
export default RightPanel;
