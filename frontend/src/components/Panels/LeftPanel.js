import React from "react";
import {makeDiv} from "../HTMLTags";


function LeftPanel(){
    return(
        <div className="leftPanel">
            {makeDiv("", "", "leftPanelButton", "Add Food")}
            {makeDiv("", "", "leftPanelButton", "Make Recipe")}
            {makeDiv("", "", "leftPanelButton", "Make Recipe")}
        </div>
    )
}
export default LeftPanel;