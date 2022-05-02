    import {getDateString} from "../components/divHelpers/monthGenerator";
    import {JSONRequest, JSONGETRequest} from "../components/RESTHelpers/JSONRequest";
    

   const storage = require("../components/tokenStorage.js");
   function makeFoodDayJSON(curDate, userId){
      
      const dateString = getDateString(curDate);
      const foodReq = {
        userId: userId,
        startDate:dateString,
        endDate:dateString,
        jwtToken:storage.retrieveToken()
      }
      return foodReq;
    }


    // this will get the latest version of the person's food day
    async function getLatestFoods(startDate, userId){
      let res = await JSONGETRequest(makeFoodDayURL(makeFoodDayJSON(startDate, userId)));
      console.log(res);
      return handleFDGetRes(res);
    }

     function handleFDGetRes(res){
      if(res.error!=0){
        console.log("error Happened"+res.error);
        return [];
      }
      console.log(res.foodRecords);
      console.log("no error");
      return res.foodRecords
    }
    function makeFoodDayURL(foodReq){
      return "api/users/data/foodRecords/?userId="+foodReq.userId+"&startDate="+foodReq.startDate+"&endDate="+foodReq.endDate+"&jwtToken="+foodReq.jwtToken;
    }
export {getLatestFoods};
