import React from "react";

function TopPanel(){
    function makeDiv(id = "", className = "", text = "", divContent = ""){
        return(
            <div id={id} className={className}>{text}{divContent}</div>
        )
    }

    function makeButton(className, onClick, txt) {
        return (
          <button type="button" className={className} onClick={onClick}>
            {txt}
          </button>
        );
      }

    return(
        <div>

        </div>
    )
}
export default TopSubPanel;