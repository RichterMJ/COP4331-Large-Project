import React, { PureComponent,useState,useEffect } from "react";
import LeftPanel from "../components/Panels/UserPageLPanel";
import RightPanel from "../components/Panels/UserPageRPanel";
import InvalidPage from "./InvalidPage";
import "./mainPageStyle.css"
import {getLatestFoods} from "./FoodList";

function UserPage() {
    function updateFoods(thisDate){
        setFoods(getLatestFoods(thisDate));
    }

    let curDate = new Date();
    const [date,setDate] = useState(curDate);
    const [foods,setFoods] = useState([]);
    // gets initial food day data
    useEffect(() =>{
      const getRecords = async () =>{
        let res = await getLatestFoods(date);
        setFoods(res);
      }
      getRecords();
    },[]);

    const _ud = localStorage.getItem('user_data');
    const user = JSON.parse(_ud);
    if (user === null){
        return (<InvalidPage/>); // user access page without login
    }
    return(
        <div id="content">
            <div id="panels">
              <LeftPanel user={user} date={date} foods = {foods} updateFoods = {updateFoods}/>
              <RightPanel user={user} date={date} setDateFunc={setDate}
                          foods = {foods} updateFoods = {updateFoods} />
            </div>
        </div>
    );
}
export default UserPage;
