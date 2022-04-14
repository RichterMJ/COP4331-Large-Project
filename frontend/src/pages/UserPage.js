import React, { PureComponent } from "react";
import LeftPanel from "../components/Panels/UserPageLPanel";
import RightPanel from "../components/Panels/UserPageRPanel";
import InvalidPage from "./InvalidPage";
import "./mainPageStyle.css"

function UserPage() {
    const _ud = localStorage.getItem('user_data');
    const user = JSON.parse(_ud);
    if (user === null){
        return (<InvalidPage/>); // user access page without login
    }
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
