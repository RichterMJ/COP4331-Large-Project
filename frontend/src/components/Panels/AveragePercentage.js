

function getNutrientSubCategoryPercentage(subCategoryNutrient){
    let totalPercentage = 0.0
    let count = 0
    
    subCategoryNutrient.nutrients.forEach((nutrient, index)=>{
        if (nutrient.RDIValue != 0){
            let fullNutrient = 100;
            let nutrientPercent = (nutrient.value / nutrient.RDIValue) * 100;
            if (nutrientPercent < fullNutrient)
                totalPercentage += (nutrient.value / nutrient.RDIValue) * 100;
            else 
                totalPercentage += fullNutrient;
            count += 1;
        }
    })
    // for (const nutrient in subCategoryNutrient.nutrients){
    //     // skip the unessential nutrients
    //     if (subCategoryNutrient[nutrient].RDIValue != 0){
    //         console.log(subCategoryNutrient[nutrient])
    //         totalPercentage += (subCategoryNutrient[nutrient].value / subCategoryNutrient[nutrient].RDIValue) * 100
    //         count += 1;
    //         console.log(count)
    //     }
    // }
    

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
        let essentialNutrientNum = 0
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