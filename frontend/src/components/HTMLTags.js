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
      <a href={href} className={className}>
        <u>{txt}</u>
      </a>
    );
}

function makeSpan(className, txt){
    return (<span className={className}>{txt}</span>);
}

function makeH2(id, className, text){
    return (<h2 id={id} className={className}>{text}</h2>)
}

export {makeDiv, makeButton, makeLink, makeSpan, makeH2};