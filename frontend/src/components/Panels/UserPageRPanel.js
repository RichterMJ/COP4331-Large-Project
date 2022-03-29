import React from "react";
import TopPanel from "./TopPanel";

function RightPanel(){
    const _ud = localStorage.getItem("user_data");
    const ud = JSON.parse(_ud);
    const userId = ud.userId;

    return(
        <div id="rightPanel">
            <TopPanel userId={userId} />
        </div>
    )
}
export default RightPanel;
