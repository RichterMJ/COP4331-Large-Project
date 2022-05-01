function prepMonth(month){
    if(month.toString().length==1){
      return "0"+(month+1);
    }
    else{
      return month;
    }
}
function prepDay(day){
     if(day.toString().length==1){
      return "0"+day;
    }
    else{
      return day;
    }

}
function getDateString(date){
  return date.getFullYear() + "-" + prepMonth(date.getMonth())+ "-" + prepDay(date.getDate());
}

export {prepMonth, getDateString};
