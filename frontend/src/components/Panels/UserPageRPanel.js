import React, {useState, useEffect} from "react";
import TopPanel from "./TopPanel";
import BottomSubPanel from "./BottomSubPanel"
import {TopSubPanel}from "./TopSubPanel"
import { JSONGETRequest } from "../RESTHelpers/JSONRequest";
function RightPanel({user,date, setDateFunc,foods,updateFoods}){
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
          <TopPanel userId={user.userID} date={date} setDateFunc={setDateFunc} updateFoods={updateFoods} />
          <TopSubPanel date= {date} userId={user.userId} foods={foods} updateFoods ={updateFoods}/>
          <BottomSubPanel date={date} foods={foods} userId={user.userId} RDINutrients={RDIChart}/>
        </div>
    )
}
export default RightPanel;
