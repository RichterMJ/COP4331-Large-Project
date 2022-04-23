import React, {useState, useEffect} from "react";
import TopPanel from "./TopPanel";
import BottomSubPanel from "./BottomSubPanel"
import {TopSubPanel}from "./TopSubPanel"
import { JSONGETRequest } from "../RESTHelpers/JSONRequest";
function RightPanel({user,date, setDateFunc}){
  const [RDIChart, setRDIChart] = useState([]);

  useEffect(()=>{
    const getRDINutrients = async () =>{
      let res = await JSONGETRequest("api/food/rdi");
      console.log(res);
      setRDIChart(res);
    }
    getRDINutrients();
  },[])
    return(
        <div id="rightPanel">
          <TopPanel userId={user.userID} date={date} setDateFunc={setDateFunc} />
          <TopSubPanel date= {date} userId={user.userId}/>
          <BottomSubPanel date={date} userId={user.userId} RDINutrients={RDIChart}/>
        </div>
    )
}
export default RightPanel;
