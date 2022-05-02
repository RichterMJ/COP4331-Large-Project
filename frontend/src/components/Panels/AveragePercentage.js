

function getNutrientSubCategoryPercentage(subCategoryNutrient){
    let totalPercentage = 0.0
    count = 0
    for (const nutrient in subCategoryNutrient){
        // skip the unessential nutrients
        if (nutrient.RDIValue == 0)
            continue;

        totalPercentage += (nutrient.value / nutrient.RDIValue) * 100
        count += 1;
    }
    return totalPercentage/count;
}
function getAverageNutrientForDay(categorizedNutrients){
    let totalPercentage = 0.0
    let totalNutrients = 0
    // get total nutrients available
    for (const subCategory in categorizedNutrients){
        categorizedNutrients[subCategory].nutrients.map((nutrient, index)=>{
            if (nutrient.RDIValue != 0){
                totalNutrients += 1;
            }
        })
    }
    for (const subCategory in categorizedNutrients){
        // get number of essential nutrients in subcategory
        essentialNutrientNum = 0
        categorizedNutrients[subCategory].nutrients.map((nutrient, index)=>{
            if (nutrient.RDIValue != 0){
                essentialNutrientNum += 1;
            }
        })
        totalPercentage += (essentialNutrientNum/totalNutrients) * categorizedNutrients[subCategory].totalAvgPercentage;
    }
    return totalPercentage
}
export {getNutrientSubCategoryPercentage,getAverageNutrientForDay}