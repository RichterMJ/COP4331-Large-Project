function prepMonth(month){
    if(month.toString().length==1){
      return "0"+month;
    }
    else{
      return month;
    }
}

function getDateString(date){
    console.log(date);
    return date.getFullYear() + "-" + prepMonth(date.getMonth())+ "-" + date.getDate();
}

export {prepMonth, getDateString};