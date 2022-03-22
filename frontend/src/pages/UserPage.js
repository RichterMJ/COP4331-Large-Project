import React, { PureComponent } from "react";
import UserPageLPanel from "../components/Panels/UserPageLPanel";
import UserPageRPanel from "../components/Panels/UserPageRPanel";



function UserPage() {
    return(
        <div id="content">
            <div id="panels">
                <UserPageLPanel/>
                <UserPageRPanel/>
            </div>
        </div>
    );
}
export default UserPage;
