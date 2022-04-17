import React, {useState, useEffect} from "react";
import {makeButton, makeLabel, makeInputDiv} from "../divHelpers/divHelpers";
import JSONRequest from "../RESTHelpers/JSONRequest";
import {RiCloseLine} from "react-icons/ri";
let storage = require('../tokenStorage');


function RecipeModal({ user, open, close, tc, setTC}){
    return (
        open ?
        <div className="darkBG">
            <div className="centered addRecipeModal theModal ">
              <div className="modalContent">
                <h1>Recipes</h1>
                {makeButton("", "closeBtn",() => {close()}, <RiCloseLine/>)}
              </div>
            </div>
        </div>
        : null
    );
}

export default RecipeModal;