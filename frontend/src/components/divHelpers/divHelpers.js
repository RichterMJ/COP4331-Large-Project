import React from "react";
  function makeActionButton(type,className,event,text,id=""){
    return(<button
           type = {type}
           className={className}
           onClick = {event}
           id = {id}>
             {text}
           </button>)
  }
export default {makeActionButton};
