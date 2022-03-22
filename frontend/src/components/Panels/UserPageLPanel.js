import React from "react";
import makeActionButton from "../divHelpers/divHelpers.js"

function LeftPanel(){

    return(
        <div className="leftPanel">
            {makeActionButton("", "leftPanelButton", "Add Food")}
            {makeActionButton("", "leftPanelButton", "Make Recipe")}
            {makeActionButton("", "leftPanelButton", "Make Recipe")}
        </div>
    )
}
export default LeftPanel;
