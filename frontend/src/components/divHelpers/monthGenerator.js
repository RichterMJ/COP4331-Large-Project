function prepMonth(month){
    console.log(month);
    if(month.toString().length==1){
      return "0"+month;
    }
    else{
      return month;
    }
}

function getDateString(date){
    console.log(date);
    return date.getFullYear() + "-" + prepMonth(date.getMonth() + 1)+ "-" + date.getDate();
}

export {prepMonth, getDateString};