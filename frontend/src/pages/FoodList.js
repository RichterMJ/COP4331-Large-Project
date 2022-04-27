    import {getDateString} from "../components/divHelpers/monthGenerator";
    import {JSONRequest, JSONGETRequest} from "../components/RESTHelpers/JSONRequest";
    const _ud = localStorage.getItem('user_data');
    const user = JSON.parse(_ud);

   const storage = require("../components/tokenStorage.js");
   function makeFoodDayJSON(curDate){
      const dateString = getDateString(curDate);
      const foodReq = {
        userId:user.userId,
        startDate:dateString,
        endDate:dateString,
        jwtToken:storage.retrieveToken()
      }
      return foodReq;
    }


    // this will get the latest version of the person's food day
    async function getLatestFoods(startDate){
      console.log(makeFoodDayURL(makeFoodDayJSON(startDate)));
      let res = await JSONGETRequest(makeFoodDayURL(makeFoodDayJSON(startDate)));
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
