
const NON_ESSENTIAL = 0

// Based on (in order of where I got them):
// 1. https://www.etoolsage.com/Chart/RDI_Chart.asp
// 2. https://www.myfooddata.com/articles/recommended-daily-intakes.php
// 3. https://my.clevelandclinic.org/health/articles/22243-amino-acids
// 
export const RDI_CHART = [
    {
        "nutrientId": 1003,
        "nutrientName": "Protein",
        "unitName": "G",
        "value": 50
    },
    {
        "nutrientId": 1004,
        "nutrientName": "Total lipid (fat)",
        "unitName": "G",
        "value": 65
    },
    {
        "nutrientId": 1005,
        "nutrientName": "Carbohydrate, by difference",
        "unitName": "G",
        "value": 300
    },
    {
        "nutrientId": 1009,
        "nutrientName": "Starch",
        "unitName": "G",
        "value": NON_ESSENTIAL
    },
    {
        "nutrientId": 1010,
        "nutrientName": "Sucrose",
        "unitName": "G",
        "value": NON_ESSENTIAL
    },
    {
        "nutrientId": 1011,
        "nutrientName": "Glucose (dextrose)",
        "unitName": "G",
        "value": NON_ESSENTIAL
    },
    {
        "nutrientId": 1012,
        "nutrientName": "Fructose",
        "unitName": "G",
        "value": NON_ESSENTIAL
    },
    {
        "nutrientId": 1013,
        "nutrientName": "Lactose",
        "unitName": "G",
        "value": NON_ESSENTIAL
    },
    {
        "nutrientId": 1050,
        "nutrientName": "Carbohydrate, by summation",
        "unitName": "G",
        "value": 300
    },
    {
        "nutrientId": 1063,
        "nutrientName": "Sugars, Total NLEA",
        "unitName": "G",
        "value": 300
    },
    {
        "nutrientId": 1087,
        "nutrientName": "Calcium, Ca",
        "unitName": "MG",
        "value": 1000
    },
    {
        "nutrientId": 1088,
        "nutrientName": "Chlorine, Cl",
        "unitName": "MG",
        "value": 3400
    },
    {
        "nutrientId": 1089,
        "nutrientName": "Iron, Fe",
        "unitName": "MG",
        "value": 18
    },
    {
        "nutrientId": 1090,
        "nutrientName": "Magnesium, Mg",
        "unitName": "MG",
        "value": 400
    },
    {
        "nutrientId": 1091,
        "nutrientName": "Phosphorus, P",
        "unitName": "MG",
        "value": 1000
    },
    {
        "nutrientId": 1092,
        "nutrientName": "Potassium, K",
        "unitName": "MG",
        "value": 3500
    },
    {
        "nutrientId": 1093,
        "nutrientName": "Sodium, Na",
        "unitName": "MG",
        "value": 2400
    },
    {
        // Uhhhh Sulfur just straight up has no RDI. This number is an estimate
        // based on the RDI of sulfur containing amino acids.
        "nutrientId": 1094,
        "nutrientName": "Sulfur, S",
        "unitName": "UG",
        "value": 13
    },
    {
        "nutrientId": 1095,
        "nutrientName": "Zinc, Zn",
        "unitName": "MG",
        "value": 15
    },
    {
        "nutrientId": 1096,
        "nutrientName": "Chromium, Cr",
        "unitName": "UG",
        "value": 120
    },
    {
        "nutrientId": 1097,
        "nutrientName": "Cobalt, Co",
        "unitName": "UG",
        "value": 5
    },
    {
        "nutrientId": 1098,
        "nutrientName": "Copper, Cu",
        "unitName": "MG",
        "value": 2
    },
    {
        "nutrientId": 1099,
        "nutrientName": "Fluoride, F",
        "unitName": "MG",
        "value": 2.9
    },
    {
        "nutrientId": 1100,
        "nutrientName": "Iodine, I",
        "unitName": "UG",
        "value": 150
    },
    {
        "nutrientId": 1101,
        "nutrientName": "Manganese, Mn",
        "unitName": "MG",
        "value": 2
    },
    {
        "nutrientId": 1102,
        "nutrientName": "Molybdenum, Mo",
        "unitName": "UG",
        "value": 75
    },
    {
        "nutrientId": 1103,
        "nutrientName": "Selenium, Se",
        "unitName": "UG",
        "value": 70
    },
    {
        "nutrientId": 1106,
        "nutrientName": "Vitamin A, RAE",
        "unitName": "UG",
        "value": 1000
    },
    {
        "nutrientId": 1109,
        "nutrientName": "Vitamin E (alpha-tocopherol)",
        "unitName": "MG",
        "value": 20
    },
    {
        "nutrientId": 1114,
        "nutrientName": "Vitamin D (D2 + D3)",
        "unitName": "UG",
        "value": 10
    },
    {
        "nutrientId": 1124,
        "nutrientName": "Vitamin E (label entry primarily)",
        "unitName": "IU",
        "value": 30
    },
    {
        "nutrientId": 1141,
        "nutrientName": "Iron, heme",
        "unitName": "MG",
        "value": 18
    },
    {
        "nutrientId": 1142,
        "nutrientName": "Iron, non-heme",
        "unitName": "MG",
        "value": 18
    },
    {
        "nutrientId": 1149,
        "nutrientName": "Salt, NaCl",
        "unitName": "MG",
        "value": 2400
    },
    {
        "nutrientId": 1162,
        "nutrientName": "Vitamin C, total ascorbic acid",
        "unitName": "MG",
        "value": 60
    },
    {
        "nutrientId": 1165,
        "nutrientName": "Thiamin",
        "unitName": "MG",
        "value": 1.5
    },
    {
        "nutrientId": 1166,
        "nutrientName": "Riboflavin",
        "unitName": "MG",
        "value": 1.7
    },
    {
        "nutrientId": 1167,
        "nutrientName": "Niacin",
        "unitName": "MG",
        "value": 20
    },
    {
        "nutrientId": 1174,
        "nutrientName": "Vitamin B-6, N411 + N412 +N413",
        "unitName": "MG",
        "value": 2
    },
    {
        "nutrientId": 1175,
        "nutrientName": "Vitamin B-6",
        "unitName": "MG",
        "value": 2
    },
    {
        "nutrientId": 1176,
        "nutrientName": "Biotin",
        "unitName": "UG",
        "value": 300
    },
    {
        "nutrientId": 1177,
        "nutrientName": "Folate, total",
        "unitName": "UG",
        "value": 400
    },
    {
        "nutrientId": 1178,
        "nutrientName": "Vitamin B-12",
        "unitName": "UG",
        "value": 6
    },
    {
        "nutrientId": 1180,
        "nutrientName": "Choline, total",
        "unitName": "MG",
        "value": 3400
    },
    {
        "nutrientId": 1183,
        "nutrientName": "Vitamin K (Menaquinone-4)",
        "unitName": "UG",
        "value": 80
    },
    {
        "nutrientId": 1184,
        "nutrientName": "Vitamin K (Dihydrophylloquinone)",
        "unitName": "UG",
        "value": 80
    },
    {
        "nutrientId": 1185,
        "nutrientName": "Vitamin K (phylloquinone)",
        "unitName": "UG",
        "value": 80
    },
    {
        "nutrientId": 1187,
        "nutrientName": "Folate, food",
        "unitName": "UG",
        "value": 400
    },
    {
        "nutrientId": 1213,
        "nutrientName": "Leucine",
        "unitName": "MG",
        "value": 2730
    },
    {
        "nutrientId": 1214,
        "nutrientName": "Lysine",
        "unitName": "MG",
        "value": 2100
    },
    {
        "nutrientId": 1215,
        "nutrientName": "Methionine",
        "unitName": "MG",
        "value": 728
    },
    {
        "nutrientId": 1216,
        "nutrientName": "Cystine",
        "unitName": "MG",
        "value": 287
    },
    {
        "nutrientId": 1217,
        "nutrientName": "Phenylalanine",
        "unitName": "MG",
        "value": 875
    },
    {
        "nutrientId": 1218,
        "nutrientName": "Tyrosine",
        "unitName": "MG",
        "value": 875
    },
    {
        "nutrientId": 1219,
        "nutrientName": "Valine",
        "unitName": "MG",
        "value": 1820
    },
    {
        "nutrientId": 1220,
        "nutrientName": "Arginine",
        "unitName": "MG",
        "value": NON_ESSENTIAL
    },
    {
        "nutrientId": 1221,
        "nutrientName": "Histidine",
        "unitName": "MG",
        "value": 14
    },
    {
        "nutrientId": 1222,
        "nutrientName": "Alanine",
        "unitName": "MG",
        "value": NON_ESSENTIAL
    },
    {
        "nutrientId": 1223,
        "nutrientName": "Aspartic acid",
        "unitName": "MG",
        "value": NON_ESSENTIAL
    },
    {
        "nutrientId": 1224,
        "nutrientName": "Glutamic acid",
        "unitName": "MG",
        "value": NON_ESSENTIAL
    },
    {
        "nutrientId": 1225,
        "nutrientName": "Glycine",
        "unitName": "MG",
        "value": NON_ESSENTIAL
    },
    {
        "nutrientId": 1226,
        "nutrientName": "Proline",
        "unitName": "MG",
        "value": NON_ESSENTIAL
    },
    {
        "nutrientId": 1227,
        "nutrientName": "Serine",
        "unitName": "MG",
        "value": NON_ESSENTIAL
    },
    {
        "nutrientId": 1232,
        "nutrientName": "Cysteine",
        "unitName": "MG",
        "value": NON_ESSENTIAL
    },
    {
        "nutrientId": 1233,
        "nutrientName": "Glutamine",
        "unitName": "MG",
        "value": NON_ESSENTIAL
    },
    {
        "nutrientId": 1234,
        "nutrientName": "Taurine",
        "unitName": "MG",
        "value": NON_ESSENTIAL
    },
    {
        "nutrientId": 1257,
        "nutrientName": "Fatty acids, total trans",
        "unitName": "G",
        "value": NON_ESSENTIAL
    },
    {
        "nutrientId": 1258,
        "nutrientName": "Fatty acids, total saturated",
        "unitName": "G",
        "value": 20
    },
    {
        "nutrientId": 1291,
        "nutrientName": "Fatty acids, other than 607-615, 617-621, 624-632, 652-654, 686-689)",
        "unitName": "G",
        "value": 4
    },
    {
        "nutrientId": 1292,
        "nutrientName": "Fatty acids, total monounsaturated",
        "unitName": "G",
        "value": 36
    },
    {
        "nutrientId": 1293,
        "nutrientName": "Fatty acids, total polyunsaturated",
        "unitName": "G",
        "value": 9
    },
    {
        "nutrientId": 2047,
        "nutrientName": "Energy (Atwater General Factors)",
        "unitName": "KCAL",
        "value": 2000
    },
    {
        "nutrientId": 2048,
        "nutrientName": "Energy (Atwater Specific Factors)",
        "unitName": "KCAL",
        "value": 2000
    }
]
