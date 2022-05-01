import React from "react";

function makeActionButton(type,className,event,text,id, disabled=""){
  return(<button
          type = {type}
          className={className}
          onClick = {event}
          id = {id}
          disabled={disabled}>
            {text}
          </button>)
}

function makeDiv(id = "", className = "", text = "", divContent=""){
    return(
      <div id={id} className={className}>{text}{divContent}</div>
    )
}
function makeLabel(htmlFor, txt, className = "") {
  return (
    <label className={className + "form-label"} htmlFor={htmlFor}>
      {txt}
    </label>
  );
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
function makeInputDiv(type, id, className, value, name, placeholder,onChangeFunc, disabled="", min="", max="") {
  return (
      <input
        className={className}
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        onChange={(d)=>onChangeFunc(d.target.value)}
        disabled={disabled}
        min={min}
        max={max}
        value={value}
      />
  );
}

export {makeInputDiv, makeLabel, makePTag, makeActionButton, makeDiv, makeButton, makeLink, makeSpan, makeH2};
