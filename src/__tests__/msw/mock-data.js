import { mockServerDateString } from "../utils";

const thisMonth = mockServerDateString(new Date());

/** Use this to mock a path parameter that uses Mongo ObjectId, so that it does not throw error */
export const mockObjectId = "123456789123456789123456"

export const mockTasks = [
  {
      "_id": "65fe84c32bd35c7910009367",
      "task": "Upload upstream transportation and distribution data",
      "complete": true,
      "category": "upstream transportation and distribution",
      "assignee": null,
      "scope": "3",
      "action": "Upload",
      "unit_type": "energy",
      "ghg_category": "3.4",
      "savior_id": "65ec0c94fec14e62f2b1eabd",
      "type": "collection",
      "created_at": "2024-03-01 15:58:09.983000"
  },
  {
      "_id": "65fe84c32bd35c7910009368",
      "task": "Upload waste generated in operations data",
      "complete": false,
      "category": "waste generated in operations",
      "assignee": null,
      "scope": "3",
      "action": "Upload",
      "unit_type": "energy",
      "ghg_category": "3.5",
      "savior_id": "65ec0c94fec14e62f2b1eabd",
      "type": "collection",
      "created_at": "2024-03-01 15:58:09.983000"
  },
  {
      "_id": "65fe84c32bd35c7910009369",
      "task": "Upload business travel data",
      "complete": false,
      "category": "business travel",
      "assignee": null,
      "scope": "3",
      "action": "Upload",
      "unit_type": "energy",
      "ghg_category": "3.6",
      "savior_id": "65ec0c94fec14e62f2b1eabd",
      "type": "collection",
      "created_at": "2024-03-01 15:58:09.983000"
  }
];

export const mockCompanyTree = [
  {picture: "https://placeholder.co/24",},
];
export const mockCompanyTeams = [
  "Procurement"
];

export const mockCompanyUsers = [
  "User1", "User2",
];

export const mockUserAccount = {
  "company": "Sprive",
  "email": "luca@sprive.com",
  "company_email": "sprive@sprive.com",
  "role": "user",
  "region": "US",
  "joined": "2023-04-02 21:29:28.995000",
  "username": "Luca Caputo",
  "team": "Procurement",
  "savior_id": "65ec0c94fec14e62f2b1eabd",
  "user_id": "6601df3c484933dc679288f6"
};

export const mockCompanyAccount = {...mockUserAccount, role: "company"};
export const defaultMockLogs = [
  {
      "_id": "66051c273e617d50e6edf46d",
      "activity": "compute",
      "value": 10000,
      "unit": "hours",
      "source_file": {
          "name": "mock-scope3.csv",
          "upload_date": "2024-03-25 08:57:00.522000",
          "id": "66019eccd60d7fcb858e0c66",
          "created_at": "2023-03-29 05:59:41.915000"
      },
      "scope": "2",
      "category": "Randomstuff",
      "unit_type": "energy",
      "ghg_category": null,
      "co2e": 5,
      "savior_id": "65ec0c94fec14e62f2b1eabd"
  },
  {
      "_id": "66051cbef3032eaed2658056",
      "activity": "compute",
      "value": 10000,
      "unit": "hours",
      "source_file": {
          "name": "mock-scope3.csv",
          "upload_date": "2023-03-25 08:57:00.522000",
          "id": "66019eccd60d7fcb858e0c66"
      },
      "scope": "2",
      "category": "Otherrandom",
      "unit_type": "energy",
      "ghg_category": null,
      "co2e": 7,
      "savior_id": "65ec0c94fec14e62f2b1eabd"
  },
  {
      "_id": "66059950f3032eaed2658057",
      "activity": "random",
      "value": 10000,
      "unit": "hours",
      "source_file": {
          "name": "mock-scope3.csv",
          "upload_date": "2022-03-25 08:57:00.522000",
          "id": "66019eccd60d7fcb858e0c66"
      },
      "scope": "2",
      "category": "Anothercate",
      "unit_type": "energy",
      "ghg_category": null,
      "co2e": 3,
      "savior_id": "65ec0c94fec14e62f2b1eabd"
  },
  {
      "_id": "66059999f3032eaed2658058",
      "activity": "random",
      "value": 10000,
      "unit": "hours",
      "source_file": {
          "name": "mock-scope3.csv",
          "upload_date": "2023-03-25 08:57:00.522000",
          "id": "66019eccd60d7fcb858e0c66"
      },
      "scope": "2",
      "category": "Lovelife",
      "unit_type": "energy",
      "ghg_category": null,
      "co2e": 8,
      "savior_id": "65ec0c94fec14e62f2b1eabd"
  },
  {
      "_id": "66059a9ef3032eaed2658059",
      "activity": "random",
      "value": 10000,
      "unit": "hours",
      "source_file": {
          "name": "mock-scope3.csv",
          "upload_date": "2023-03-25 08:57:00.522000",
          "id": "66019eccd60d7fcb858e0c66"
      },
      "scope": "2",
      "category": "theomost",
      "unit_type": "energy",
      "ghg_category": null,
      "co2e": 7,
      "savior_id": "65ec0c94fec14e62f2b1eabd"
  },
  {
      "_id": "66084a7a004f0cd0e8b6f6a7",
      "activity": "compute",
      "value": 10000,
      "unit": "hours",
      "source_file": {
          "name": "mock-scope3.csv",
          "upload_date": "2024-03-30 17:23:06.063000",
          "id": "66084a7a004f0cd0e8b6f6a6"
      },
      "scope": "3",
      "category": "purchased goods and services",
      "unit_type": "money",
      "ghg_category": "3.1",
      "co2e": 10,
      "savior_id": "65ec0c94fec14e62f2b1eabd"
  },
  {
      "_id": "66084a7a004f0cd0e8b6f6a8",
      "activity": "in-house meals",
      "value": 2500,
      "unit": "usd",
      "source_file": {
          "name": "mock-scope3.csv",
          "upload_date": "2024-03-30 17:23:06.063000",
          "id": "66084a7a004f0cd0e8b6f6a6"
      },
      "scope": "3",
      "category": "testing",
      "unit_type": "money",
      "ghg_category": "3.1",
      "co2e": 8,
      "savior_id": "65ec0c94fec14e62f2b1eabd"
  },
  {
      "_id": "660f8e127a40d66fa42f169a",
      "activity": "compute",
      "value": 10000,
      "co2e": 15,
      "unit": "hours",
      "source_file": {
          "name": "mock-scope3.csv",
          "upload_date": "2024-04-05 05:37:22.167000",
          "id": "660f8e127a40d66fa42f1699"
      },
      "scope": "3",
      "category": "upstream transportation and distribution",
      "unit_type": "energy",
      "ghg_category": "3.4",
      "savior_id": "65ec0c94fec14e62f2b1eabd"
  },
  {
    "_id": "660f8e127a40d66fa42f169a",
    "activity": "testing",
    "value": 10000,
    "co2e": 15,
    "unit": "hours",
    "source_file": {
        "name": "mock-scope3.csv",
        "upload_date": "2024-04-05 05:37:22.167000",
        "id": "660f8e127a40d66fa42f1699"
    },
    "scope": "3",
    "category": "upstream transportation and distribution",
    "unit_type": "energy",
    "ghg_category": "3.4",
    "savior_id": "65ec0c94fec14e62f2b1eabd"
  },
  {
    "_id": "660f8e127a40d66fa42f169a",
    "activity": "loving",
    "value": 10000,
    "co2e": 15,
    "unit": "hours",
    "source_file": {
        "name": "mock-scope3.csv",
        "upload_date": "2024-04-05 05:37:22.167000",
        "id": "660f8e127a40d66fa42f1699"
    },
    "scope": "3",
    "category": "upstream transportation and distribution",
    "unit_type": "energy",
    "ghg_category": "3.4",
    "savior_id": "65ec0c94fec14e62f2b1eabd"
  },
  {
    "_id": "660f8e127a40d66fa42f169a",
    "activity": "life",
    "value": 10000,
    "co2e": 15,
    "unit": "hours",
    "source_file": {
        "name": "mock-scope3.csv",
        "upload_date": "2024-04-05 05:37:22.167000",
        "id": "660f8e127a40d66fa42f1699"
    },
    "scope": "3",
    "category": "upstream transportation and distribution",
    "unit_type": "energy",
    "ghg_category": "3.4",
    "savior_id": "65ec0c94fec14e62f2b1eabd"
  },
  {
    "_id": "660f8e127a40d66fa42f169a",
    "activity": "testing2",
    "value": 10000,
    "co2e": 15,
    "unit": "hours",
    "source_file": {
        "name": "mock-scope3.csv",
        "upload_date": "2024-04-05 05:37:22.167000",
        "id": "660f8e127a40d66fa42f1699"
    },
    "scope": "3",
    "category": "upstream transportation and distribution",
    "unit_type": "energy",
    "ghg_category": "3.4",
    "savior_id": "65ec0c94fec14e62f2b1eabd"
},
{
  "_id": "660f8e127a40d66fa42f169a",
  "activity": "testing3",
  "value": 10000,
  "co2e": 15,
  "unit": "hours",
  "source_file": {
      "name": "mock-scope3.csv",
      "upload_date": "2024-04-05 05:37:22.167000",
      "id": "660f8e127a40d66fa42f1699"
  },
  "scope": "3",
  "category": "upstream transportation and distribution",
  "unit_type": "energy",
  "ghg_category": "3.4",
  "savior_id": "65ec0c94fec14e62f2b1eabd"
},
  {
      "_id": "660f8e127a40d66fa42f169b",
      "activity": "in-house meals",
      "value": 2500,
      "co2e": 10,
      "unit": "usd",
      "source_file": {
          "name": "mock-scope3.csv",
          "upload_date": "2024-04-05 05:37:22.167000",
          "id": "660f8e127a40d66fa42f1699"
      },
      "scope": "3",
      "category": "testingcategories",
      "unit_type": "energy",
      "ghg_category": "3.4",
      "savior_id": "65ec0c94fec14e62f2b1eabd"
  }
]

export const mockProduct = {
  "_id": null,
  "stages": [
      {
          "co2e": 3,
          "num_processes": 4,
          "stage": "sourcing",
          "processes": [
              {
                  "_id": "65eca801887e19890e1d630d",
                  "process": "plants",
                  "activity": "textiles",
                  "activity_id": "textiles-type_textiles",
                  "activity_unit": "kg",
                  "activity_unit_type": "money",
                  "activity_value": 10,
                  "co2e": 2
              },
              {
                  "_id": "65eca814887e19890e1d6312",
                  "process": "erithrytol",
                  "activity": "erithrytol",
                  "activity_id": "consumer_goods-type_furniture_other_manufactured_goods_not_elsewhere_specified",
                  "activity_unit": "g",
                  "activity_unit_type": "money",
                  "activity_value": 200,
                  "co2e": 0
              },
              {
                  "_id": "65fa3f8fdbe7deffa251eff2",
                  "process": "plants2",
                  "activity": "furniture",
                  "activity_id": "consumer_goods-type_furniture_other_manufactured_goods_not_elsewhere_specified",
                  "activity_unit": "kg",
                  "activity_unit_type": "money",
                  "activity_value": 200,
                  "co2e": 1
              },
              {
                  "_id": "65fda5559ccb4045657e1a33",
                  "process": "Checkindex",
                  "activity": "sugar",
                  "activity_id": "consumer_goods-type_sugar",
                  "activity_unit": "kg",
                  "activity_unit_type": "money",
                  "activity_value": 1,
                  "co2e": 0
              }
          ],
          "last_update": null
      },
      {
          "co2e": 42,
          "num_processes": 3,
          "stage": "assembly",
          "processes": [
              {
                  "_id": "65eca8ba887e19890e1d6326",
                  "process": "packaging",
                  "activity": "packaging",
                  "activity_id": "textiles-type_textiles",
                  "activity_unit": "kg",
                  "activity_unit_type": "money",
                  "activity_value": 10,
                  "co2e": 19
              },
              {
                  "_id": "65eca8cd887e19890e1d632b",
                  "process": "labeling",
                  "activity": "labeling",
                  "activity_id": "textiles-type_textiles",
                  "activity_unit": "kg",
                  "activity_unit_type": "money",
                  "activity_value": 20,
                  "co2e": 4
              },
              {
                  "_id": "65eca8fd887e19890e1d6330",
                  "process": "examining",
                  "activity": "examining",
                  "activity_id": "consumer_goods-type_sugar",
                  "activity_unit": "hours",
                  "activity_unit_type": "money",
                  "activity_value": 10,
                  "co2e": 19
              }
          ],
          "last_update": null
      },
      {
          "co2e": 39,
          "num_processes": 3,
          "stage": "processing",
          "processes": [
              {
                  "_id": "65eca847887e19890e1d6317",
                  "process": "powderizing",
                  "activity": "powderizing",
                  "activity_id": "textiles-type_textiles",
                  "activity_unit": "sum",
                  "activity_unit_type": "money",
                  "activity_value": 10,
                  "co2e": 6
              },
              {
                  "_id": "65eca85b887e19890e1d631c",
                  "process": "formulating",
                  "activity": "formulating",
                  "activity_id": "consumer_goods-type_sugar",
                  "activity_unit": "usd",
                  "activity_unit_type": "money",
                  "activity_value": 1,
                  "co2e": 13
              },
              {
                  "_id": "65eca897887e19890e1d6321",
                  "process": "blending",
                  "activity": "blending",
                  "activity_id": "consumer_goods-type_furniture_other_manufactured_goods_not_elsewhere_specified",
                  "activity_unit": "kwh",
                  "activity_unit_type": "money",
                  "activity_value": 10,
                  "co2e": 20
              }
          ],
          "last_update": null
      },
      {
          "co2e": 31,
          "num_processes": 4,
          "stage": "transport",
          "processes": [
              {
                  "_id": "65eca931887e19890e1d6335",
                  "process": "Freight travel",
                  "activity": "Freight travel",
                  "activity_id": "consumer_goods-type_furniture_other_manufactured_goods_not_elsewhere_specified",
                  "activity_unit": "mi",
                  "activity_unit_type": "money",
                  "activity_value": 150,
                  "co2e": 10
              },
              {
                  "_id": "65eca940887e19890e1d633a",
                  "process": "Airplane",
                  "activity": "Airplane",
                  "activity_id": "textiles-type_textiles",
                  "activity_unit": "km",
                  "activity_unit_type": "money",
                  "activity_value": 3000,
                  "co2e": 1
              },
              {
                  "_id": "65eca95c887e19890e1d633f",
                  "process": "Road travel",
                  "activity": "Road travel",
                  "activity_id": "consumer_goods-type_sugar",
                  "activity_unit": "mi",
                  "activity_unit_type": "money",
                  "activity_value": 100,
                  "co2e": 13
              },
              {
                  "_id": "65eca9b3887e19890e1d6344",
                  "process": "Warehouse Pickup",
                  "activity": "Warehouse Pickup",
                  "activity_id": "consumer_goods-type_furniture_other_manufactured_goods_not_elsewhere_specified",
                  "activity_unit": "mi",
                  "activity_unit_type": "money",
                  "activity_value": 120,
                  "co2e": 7
              }
          ],
          "last_update": null
      }
  ],
  "co2e": 115,
  "published": false,
  "unit_types": [
      "count"
  ],
  "product_id": "65eca7930179199704c58ad0",
  "activity": "textiles",
  "name": "Protein powder",
  "stars": 0,
  "keywords": "Protein powder crafted and curated with sustainability in mind"
}