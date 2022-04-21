import React, {useState, useEffect} from "react";
import {makeButton, makeLabel, makeInputDiv, makeActionButton} from "../divHelpers/divHelpers";
import {JSONRequest, JSONGETRequest} from "../RESTHelpers/JSONRequest";
import {RiCloseLine} from "react-icons/ri";
import {FiEdit2} from "react-icons/fi";
import {MdDeleteOutline} from "react-icons/md";
import {AiOutlineInfoCircle} from "react-icons/ai";
import { makeErrorMessage, displayRepsonseMessage } from "../Validators/InputValidator";
import AddRecipeModal from "./RecipeSubModals/AddRecipeModal";
import EditRecipeModal from "./RecipeSubModals/EditRecipeModal";

let storage = require('../tokenStorage');

function RecipeModal({ user, open, close, tc, setTC}){
    const [searchQuery, setSearchQuery] = useState("");
    const [recipeList, setRecipeList] = useState([]);
    const [viewDetailOpen, setViewDetailOpen] = useState([]);
    const [responseMessage, setResponseMessage] = useState({
        type: '',
        message: ''
    });
    const [triggerRender, setTriggerRender] = useState(true);
    const [addRecipeOpen, setAddRecipeOpen]  = useState(false);
    const [editRecipeOpen, setEditRecipeOpen] = useState(false);
    const [selectedEditRecipe, setSelectedEditRecipe] = useState({});
    useEffect(()=>{
        const getRecipes = async () =>{
            let res = await getAllRecipes();
            console.log(res.recipes);
            setRecipeList(res.recipes);
        }
        getRecipes();
        console.log("hello")
    },[open, triggerRender])
    useEffect(() =>{
        setViewDetailOpen(Array(recipeList.length).fill(false));
    }, [recipeList])
    console.log(editRecipeOpen);
    console.log(addRecipeOpen)
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
            <>
            <div className="recipeDiv row">
                <div className="RecipeName col-8">
                    {recipe.description}
                </div>
                <div className="recipeButtons col-4">
                    {makeButton("editRecipeBtn", "btn", ()=>{editRecipe(recipe)}, <FiEdit2 key={index}/>)}
                    {makeButton("deleteRecipeBtn", "btn", ()=>{deleteRecipe(recipe)}, <MdDeleteOutline key={index}/>)}
                    {makeButton("RecipeDetailBtn", "btn", ()=>{displayRecipeDetail(recipe, index)}, <AiOutlineInfoCircle key={index}/>)}
                </div>
            </div>
            {viewDetailOpen[index] && <RecipeDetail key={index} recipe={recipe} index={index}/>}
            </>
        );
    }
    function RecipeDetail({recipe, index}){
        
        return(
            <div className="recipeDetail w-100 text-right">
                {makeButton("recipeDetailClosingBtn", "btn", ()=>{toggleViewOpenDetails(index)}, <RiCloseLine key={index}/>)}
                {recipe.ingredients.map(recipeFood =>{
                    return (
                    <p className="text-left">{`${recipeFood.amountUsed.quantity} ${recipeFood.food.description} (${recipeFood.amountUsed.portion.gramAmount}g)`}</p>
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
    function toggleAddRecipeOpen(){
        setAddRecipeOpen(!addRecipeOpen);
    }
    function editRecipe(recipe){
        console.log("edit")
        // switch to diffrent modal
        setSelectedEditRecipe(recipe);
        setEditRecipeOpen(true);
        close();
    }
    function prepareDeleteRecipeJSON(recipe){
        const deleteRecipeJSON = {
            recipeId: recipe.recipeId,
            jwtToken: storage.retrieveToken()
        }
        return JSON.stringify(deleteRecipeJSON);
    }
    async function deleteRecipe(recipe){
        // api call to delete recipe
        const deleteRecipeJSON = prepareDeleteRecipeJSON(recipe);
        let res = await JSONRequest("DELETE", deleteRecipeJSON, "api/users/data/recipes");
        console.log(res)
        if (res.error ==0){
            console.log(res);
            storage.storeToken(res);
            setTriggerRender(!triggerRender);
            setResponseMessage({...responseMessage, type:'success', message: 'successfully deleted'})
            setTimeout(()=>setResponseMessage({...responseMessage, message:''}), 2000);
        } else {
            setResponseMessage({...responseMessage, type:'error', message: 'Error occurred'})
            setTimeout(()=>setResponseMessage({...responseMessage, message:''}), 2000);
        }
    }
    function displayRecipeDetail(recipe, index){
        toggleViewOpenDetails(index);
    }
    async function getAllRecipes(){
        // make api call
        let curToken = storage.retrieveToken();
        let res = await JSONGETRequest(`api/users/data/recipes?userId=${user.userId}&jwtToken=${curToken}`);
        if (res.error == 0){
            console.log(res);
            storage.storeToken(res);
            return res;
        } else {
            setResponseMessage({...responseMessage, type:'error', message: 'Error occurred'})
            setTimeout(()=>setResponseMessage({...responseMessage, message:''}), 2000);
        }
        return null;
    }
    function searchRecipe(){
        return null
    }
    function addNewRecipe(){
        // switch to different modal 
        toggleAddRecipeOpen();
        close();
    }
    return (
        open ?
        <div className="darkBG">
            <div className="centered addRecipeModal theModal ">
              <div className="modalContent container">
                <h1>Recipes</h1>
                {makeButton("", "closeBtn",() => {close()}, <RiCloseLine/>)}
                {makeSearchRecipeBar()}
                {displayRepsonseMessage(responseMessage)}
                {makeRecipeList()}
              </div>
            </div>
            
        </div>
        : (
            <main>
            {<EditRecipeModal recipe={selectedEditRecipe} open={editRecipeOpen} backToRecipe={close} close={()=>{setEditRecipeOpen(!editRecipeOpen)}} tc={tc} setTC={setTC}/>}
            {<AddRecipeModal user={user} open={addRecipeOpen} backToRecipe={close} close={toggleAddRecipeOpen} tc={tc} setTC={setTC} />}
            </main>
        )
    );
}

export default RecipeModal;