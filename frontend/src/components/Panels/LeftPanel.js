import React from "react";

function LeftPanel(){
    function makeDiv(id = "", className = "", text = "", divContent = ""){
        return(
            <div id={id} className={className}>{text}{divContent}</div>
        )
    }

    return(
        <div className="leftPanel">
            {makeDiv("", "leftPanelButton", "Add Food")}
            {makeDiv("", "leftPanelButton", "Make Recipe")}
            {makeDiv("", "leftPanelButton", "Make Recipe")}
        </div>
    )
}
export default LeftPanel;