import React, { PureComponent } from "react";
import LeftPanel from "../components/Panels/LeftPanel";
import RightPanel from "../components/Panels/RightPanel";



function UserPage() {
    return(
        <div id="content">
            <div id="panels">
                <LeftPanel/>
                <RightPanel/>
            </div>
        </div>
    );
}
export default UserPage;
