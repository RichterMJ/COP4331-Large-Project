import React, {useState, useEffect} from "react";
import {makeButton, makeLabel, makeInputDiv, makeActionButton} from "../divHelpers/divHelpers";
import GETRequest from "../RESTHelpers/GETRequest";
import JSONRequest from "../RESTHelpers/JSONRequest";
import {RiCloseLine} from "react-icons/ri";
import {FiEdit2} from "react-icons/fi";
import {MdDeleteOutline} from "react-icons/md";
import {AiOutlineInfoCircle} from "react-icons/ai";

let storage = require('../tokenStorage');

function RecipeModal({ user, open, close, tc, setTC}){
    const [searchQuery, setSearchQuery] = useState("");
    const [recipeList, setRecipeList] = useState([]);
    const [viewDetailOpen, setViewDetailOpen] = useState([]);
    
    useEffect(()=>{
        const getRecipes = async () =>{
            let res = await getAllRecipes();
            console.log(res.recipes);
            console.log("hello")
            setRecipeList(res.recipes);
        }
        getRecipes();
        console.log('dasd');
    },[])
    useEffect(() =>{
        setViewDetailOpen(Array(recipeList.length).fill(false));
    }, [recipeList])
    function makeSearchRecipeBar(){
        return (
            <div className="recipeSearchBar row w-100 justify-content-start">
                <div className="searchRecipeInput col-7">
                    {makeInputDiv("text", "searchRecipeInput", "form-control w-100", searchQuery, "searchRecipeInput", "search recipe", setSearchQuery)}
                </div>
                <div className="searchRecipeBtn col-2 w-100">
                    {makeActionButton("button", "btn btn-primary w-100", ()=>{searchRecipe()}, "Search", "searchRecipeBtn")}
                </div>
                <div className="addNewRecipeBtn col-3 w-100">
                    {makeActionButton("button", "btn btn-success w-100", ()=>{addNewRecipe()}, "New Recipe", "addNewRecipeBtn")}
                </div>
            </div>
        );
    }
    function RecipeDiv({recipe, index}){
        return (
            <div className="recipeDiv row">
                <div className="RecipeName col-8">
                    {recipe.description}
                </div>
                <div className="recipeButtons col-4">
                    {makeButton("editRecipeBtn", "btn", ()=>{editRecipe(recipe)}, <FiEdit2 key={index}/>)}
                    {makeButton("deleteRecipeBtn", "btn", ()=>{deleteRecipe(recipe)}, <MdDeleteOutline key={index}/>)}
                    {makeButton("RecipeDetailBtn", "btn", ()=>{displayRecipeDetail(recipe, index)}, <AiOutlineInfoCircle key={index}/>)}
                </div>
                {viewDetailOpen[index] && <RecipeDetail key={index} recipe={recipe} index={index}/>}
            </div>
        );
    }
    function RecipeDetail({recipe, index}){
        
        return(
            <div className="recipeDetail position-relative">
                {makeButton("recipeDetailClosingBtn", "btn position-absolute top-0 end-0", ()=>{toggleViewOpenDetails(index)}, <RiCloseLine/>)}
                {recipe.ingredients.map(recipeFood =>{
                    return (
                    <p>{`${recipeFood.amountUsed.quantity} ${recipeFood.description} (${recipeFood.amountUsed.portion.gramAmount}g)`}</p>
                    );
                })}
            </div>
        );
    }
    function toggleViewOpenDetails(index){
        let updateViewDetailOpen  = [...viewDetailOpen];
        updateViewDetailOpen[index] = !viewDetailOpen[index];
        console.log(updateViewDetailOpen);
        setViewDetailOpen(updateViewDetailOpen);
    }
    function makeRecipeList(){
        console.log("makeREcipe");
        console.log(recipeList);
        return (
            <div className="recipeListDiv container pt-4">
                <table className="table table-striped table-hover">
                    <tbody>
                        {recipeList.map((recipe, index) =>{
                            return (
                            <tr className="">
                                <td>
                                    <RecipeDiv recipe={recipe} key={index} index={index}/>
                                </td>
                            </tr>
                            );
                        })}
                    </tbody>
                </table>
                {/* {recipeList.map((recipe, index) =>{
                            return (
                                    <RecipeDiv recipe={recipe} key={index} index={index}/>
                            );
                        })} */}
            </div>
        )
    }
    function editRecipe(recipe){
        // switch to diffrent modal
        return null;
    }
    function deleteRecipe(recipe){
        // api call to delete recipe
        return null;
    }
    function displayRecipeDetail(recipe, index){
        toggleViewOpenDetails(index);
    }
    async function getAllRecipes(){
        // make api call
        let curToken = storage.retrieveToken();
        let res = await GETRequest(`api/users/data/recipes?userId=${user.userId}&jwtToken=${curToken}`);
        if (res.error == 0){
            console.log(res);
            storage.storeToken(res);
            return res;
        }
        return null;
    }
    function searchRecipe(){
        return null
    }
    function addNewRecipe(){
        // switch to different modal 

        return null;
    }
    return (
        open ?
        <div className="darkBG">
            <div className="centered addRecipeModal theModal ">
              <div className="modalContent container">
                <h1>Recipes</h1>
                {makeButton("", "closeBtn",() => {close()}, <RiCloseLine/>)}
                {makeSearchRecipeBar()}
                {makeRecipeList()}
              </div>
            </div>
        </div>
        : null
    );
}

export default RecipeModal;