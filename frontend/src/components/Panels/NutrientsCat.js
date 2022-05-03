import React, { Component } from 'react';


const nutrientCatIDs = {
    vitaminIDs: [
        1106, 1109, 1114, 1124, 1162, 1165, 1166, 1167, 1174, 1175, 1176, 1177, 1178, 1180, 1183, 1184, 1185, 1187
    ],
    mineralIDs:[
        1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095, 1096, 1097, 1098, 1099, 1100, 1101, 1102, 1103, 1141, 1142, 1149
    ],
    aminosIDs: [
        1213, 1214, 1215, 1216, 1217, 1218, 1219, 1220, 1221, 1222, 1223, 1224, 1225, 1226, 1227, 1232, 1233, 1234
    ],
    macroIDs:[
        1003, 1004, 1005, 1009, 1010, 1011, 1012, 1013, 1050, 1063, 1257, 1258, 1291, 1292, 1293,2047,2048
    ]
}
// function categorize list of nutrients into four main categorise
function categorizeNutrients(nutrients) {
    let categorizedNutrients = {
        vitamins: {
            name: "Vitamins",
            nutrients: []
        },
        minerals: {
            name: "Minerals",
            nutrients: []
        },
        aminos: {
            name: "Aminos",
            nutrients: []
        },
        macros: {
            name: "Macros",
            nutrients: []
        } 
    }
    nutrients.map(nutrient =>{
        if (nutrientCatIDs.vitaminIDs.includes(nutrient.nutrientId)) {
            categorizedNutrients.vitamins.nutrients.push(nutrient);
        } else if (nutrientCatIDs.mineralIDs.includes(nutrient.nutrientId)){
            categorizedNutrients.minerals.nutrients.push(nutrient);
        } else if (nutrientCatIDs.aminosIDs.includes(nutrient.nutrientId)){
            categorizedNutrients.aminos.nutrients.push(nutrient);
        } else if (nutrientCatIDs.macroIDs.includes(nutrient.nutrientId)){
            categorizedNutrients.macros.nutrients.push(nutrient);
        } 
    })
    
    return categorizedNutrients;
}
// function addRDIAmount(userNutrients, RDINutrients){
//     const nutrientsWithRDI = {...userNutrients};
    
//     for (const key in nutrientsWithRDI){
//         nutrientsWithRDI[key].nutrients.map((userNutrient,index) =>{
//             RDINutrients[key].nutrients.map(RDINutrient =>{
//                 if (userNutrient.nutrientId == RDINutrient.nutrientId){
//                     nutrientsWithRDI[key].nutrients[index] = {...userNutrient, RDIValue: RDINutrient.value};
//                 }
//             })
//         })
//     }

//     return nutrientsWithRDI;
// }
function addRDIAmount(userNutrients, RDINutrients){
    const nutrientsWithRDI = {...RDINutrients};
   
    for (const key in nutrientsWithRDI){
        nutrientsWithRDI[key].nutrients.map((RDINutrient,index) =>{
            nutrientsWithRDI[key].nutrients[index].RDIValue = RDINutrient.value;
            nutrientsWithRDI[key].nutrients[index] ={...nutrientsWithRDI[key].nutrients[index], value:0}
            userNutrients[key].nutrients.map(userNutrient =>{
                if (userNutrient.nutrientId == RDINutrient.nutrientId){
                    nutrientsWithRDI[key].nutrients[index].value = userNutrient.value;
                }
            })
        })
    }
    
    return nutrientsWithRDI;
}
export {categorizeNutrients, addRDIAmount};
