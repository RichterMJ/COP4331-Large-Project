import React, { PureComponent } from "react";
import LeftPanel from "../components/Panels/UserPageLPanel";
import RightPanel from "../components/Panels/UserPageRPanel";
import "./mainPageStyle.css"

function UserPage() {
    const _ud = localStorage.getItem('user_data');
    const user = JSON.parse(_ud);

    return(
        <div id="content">
            <div id="panels">
        <LeftPanel user={user}/>
        <RightPanel user={user}/>
            </div>
        </div>
    );
}
export default UserPage;
