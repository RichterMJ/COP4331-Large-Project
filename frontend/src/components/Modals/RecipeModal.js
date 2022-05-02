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
import {getDateString} from "../divHelpers/monthGenerator";

let storage = require('../tokenStorage');

function RecipeModal({ user, open, date, close, updateFoods}){
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
            let searchResults = getRecipeSearchResults(res.recipes, searchQuery);
            handleSearchResult(searchResults, res.recipes);
        }
        getRecipes();
    },[open, triggerRender, searchQuery])
    
    useEffect(() =>{
        setViewDetailOpen(Array(recipeList.length).fill(false));
    }, [recipeList])

    function handleSearchResult(searchResults, recipesResponse){
        if (searchResults === null){
            setRecipeList(recipesResponse);
            setResponseMessage({type: "", message:""})
        } else {
            if (searchResults.length == 0){
                setRecipeList([]);
                setResponseMessage({type: "error", message:"No results found"})
            } else {
                setRecipeList(searchResults);
                setResponseMessage({type: "", message:""})
            }
        }
    }
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
                    {makeButton("addToFoodList", "btn", ()=>{addToFoodList(recipe)}, "Add")}
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
                <table className="table table-striped table-hover" id="recipeTable">
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

    async function addToFoodList(recipe){
        for await (let ingredient of recipe.ingredients)
            await addFood(ingredient);
        updateFoods(date)
    }

    function makeFoodRecordJSON(ingredient){
        const amount = ingredient.amountUsed;

        const foodData = {
          food: ingredient.food,
          userId: user.userId,
          eatenTimestamp: getDateString(date),
          amountConsumed: {portion: amount.portion, quantity: Number(amount.quantity)},
          jwtToken: storage.retrieveToken()
        }
  
        return JSON.stringify(foodData);
    }
  
    async function addFood(ingredient){
        const foodJSON = makeFoodRecordJSON(ingredient);

        console.log(foodJSON);
        let res = await JSONRequest("POST", foodJSON, "api/users/data/foodRecords");
        console.log(res);
        console.log(res.error);
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
    function getRecipeSearchResults(recipesList, query){
        if(query){
            let results = recipesList.filter((recipe) => recipe.description.toLowerCase().includes(query.toLowerCase()));
            return results
        }
        else return null;
    }
    function searchRecipe(){
        setSearchQuery(searchQuery);
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
            {<EditRecipeModal recipe={selectedEditRecipe} open={editRecipeOpen} backToRecipe={close} close={()=>{setEditRecipeOpen(!editRecipeOpen)}}/>}
            {<AddRecipeModal user={user} open={addRecipeOpen} backToRecipe={close} close={toggleAddRecipeOpen}/>}
            </main>
        )
    );
}

export default RecipeModal;