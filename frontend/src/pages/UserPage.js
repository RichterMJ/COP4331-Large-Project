import React, { PureComponent,useState,useEffect } from "react";
import LeftPanel from "../components/Panels/UserPageLPanel";
import RightPanel from "../components/Panels/UserPageRPanel";
import InvalidPage from "./InvalidPage";
import "./mainPageStyle.css"
import {getLatestFoods} from "./FoodList";
function UserPage() {
    async function updateFoods(thisDate){
         setFoods(await getLatestFoods(thisDate, user.userId));
    }

    let curDate = new Date();
    const [date,setDate] = useState(curDate);
    const [foods,setFoods] = useState([]);
    // gets initial food day data

    const _ud = localStorage.getItem('user_data');
    const user = JSON.parse(_ud);
useEffect(() =>{
      const getRecords = async () =>{
        console.log("THIS IS DATE");
        console.log(date);
        let res = await getLatestFoods(date, user.userId);
        setFoods(res);
      }
      getRecords();
    },[]);

    if (user === null){
        return (<InvalidPage/>); // user access page without login
    }
    return(
        <div id="content">
            <div id="panels">
              <LeftPanel user={user} date={date}
                         foods = {foods} updateFoods = {updateFoods}/>
              <RightPanel user={user} date={date} setDateFunc={setDate}
                          foods = {foods} updateFoods = {updateFoods} />
            </div>
        </div>
    );
}
export default UserPage;
