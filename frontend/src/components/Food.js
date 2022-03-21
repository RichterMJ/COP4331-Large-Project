import React from "react";

const Food = (foodInfo) => {

    function makeImg(src, className){
        return <img src={src} className={className}/>;
    }

    return(
      <div className="container">
        <div className="card smallCard">
          <div className="card-body">
            <h2 className="text-center">{foodInfo.name}</h2>
            {makeImg(foodInfo.src, "smallImage")}
          </div>
        </div>
      </div>
    )
}
export default Food;