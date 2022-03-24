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

function makeDiv(id = "", className = "", text = "", divContent = ""){
    return(
      <div id={id} className={className}>{text}{divContent}</div>
    )
}

function makeButton(id, className, onClick, txt) {
    return (
      <button type="button" id={id} className={className} onClick={onClick}>
        {txt}
      </button>
    );
}

function makeLink(href, className, txt) {
    return (
      <a className={className} href={href} >
        {txt}
      </a>
    );
}

function makeSpan(className, txt){
    return (<span className={className}>{txt}</span>);
}

function makeH2(id, className, text){
    return (<h2 id={id} className={className}>{text}</h2>)
}
function makePTag(className, text) {
  return <p className={className}>{text}</p>;
}

export {makePTag, makeActionButton, makeDiv, makeButton, makeLink, makeSpan, makeH2};
