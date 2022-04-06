import React, { PureComponent } from "react";
import LeftPanel from "../components/Panels/UserPageLPanel";
import RightPanel from "../components/Panels/UserPageRPanel";
import "./mainPageStyle.css"

function UserPage(props) {
    return(
        <div id="content">
            <div id="panels">
        <LeftPanel user ={props.user}/>
        <RightPanel user = {props.user}/>
            </div>
        </div>
    );
}
export default UserPage;
