from root.saviors.savior import Savior
from bson import ObjectId

class Partner(Savior):
    __slots__ = ("products", "suppliers")
    
    def __init__(self, savior_id: str):
        super().__init__(savior_id=savior_id, savior_type="partners")
        self.savior_type = "partners"
        self.dashboards.update({
            "products": lambda: self._products,
            "suppliers": lambda: self._suppliers
        })
              
    def get_overview(self, *args, **kwargs):
        """Get an overview for partner dashboard"""
        overview = super().get_overview(*args, **kwargs,)
        savior_id = self.savior_id
        return {
            **overview, 
            "products": list(
                self.emission_factors.find(
                    {"savior_id": self.savior_id, "source": "partners"}
                )
            ),
            "unprocessed_files": self.db.logs.distinct(
                "source_file.name",
                {"savior_id": savior_id, "co2e": {"$exists": False}}
            )
        }
    
    def store_data(self, data: list[dict]) -> None:
        self.db.saviors.update_one(
            {"savior_id": self.savior_id}, 
            {"$push": {"uploaded_data": data}},
            upsert=True
        )
        
        return data
    
    def get_files(self, file: str = None, processing_only: bool = False):
        if processing_only:
            return list(self.db.logs.find({
                "savior_id": self.savior_id,
                "source_file.name": file,
                "co2e": {"$exists": False}
            }))
        elif file:
            pipeline =  [
                {"$match": {"savior_id": self.savior_id, "source_file.name": file}},
                {
                    "$addFields": {
                        "processed": {"$gt": ["$co2e", None]}
                    }
                },
                {"$sort": {"processed": 1, "created": -1}}
            ]
        else:
            pipeline = [
                {"$match": {"savior_id": self.savior_id}},
                {
                    "$addFields": {
                        "needs_processing": {
                            "$lt": ["$co2e", None]
                        }
                    }
                },
                {
                    "$group": {
                        "_id": "$source_file.name",
                        "needs_processing": {
                            "$addToSet": "$needs_processing"
                        },
                        "size": {"$first": "$source_file.size"},
                        "co2e": {"$sum": "$co2e"},
                        "date": {"$min": "$created"},
                    }
                },
                {
                    "$addFields": {
                        "needs_processing": {
                            "$anyElementTrue": ["$needs_processing"]
                        }
                    },
                },
                {"$sort": {"needs_processing": 1}}
        ]
        return list(self.db.logs.aggregate(pipeline))
    
    def add_supplier(self, suppliers: str | list[str]) -> dict:
        return self.db.saviors.update_one(
            {"savior_id": self.savior_id}, 
            {"$addToSet": {"suppliers": suppliers}}, 
            upsert=True
        ).upserted_id
        
    @property
    def _suppliers(self):
       return list(
           self.db.saviors.aggregate(
               [
                    {"$match": {"_id": self.savior_id}},
                    {"$unwind": "$suppliers"},
                    {
                        "$lookup": {
                            "from": "suppliers",
                            "localField":"suppliers._id",
                            "foreignField": "_id",
                            "as": "info"
                        }
                    },
                    {
                        "$replaceRoot": { 
                            "newRoot": {
                                "$mergeObjects": [{"$arrayElemAt": ["$info", 0]}, "$suppliers"] 
                            }
                        }
                    }
                ]
            )
        )
        
    @property
    def _products(self):
        products = list(self.db.products.aggregate(
            [
                {"$match": {"savior_id": self.savior_id}},
                {
                    "$group": {
                        "_id": "$name", 
                        "co2e": {"$sum": "$co2e"},
                        "co2e_avoided": {"$sum": "$co2e_avoided"},
                        "keywords": {"$first": "$keywords"},
                        "category": {"$first": "$category"},
                        "product_id": {"$first": "$product_id"},
                        "rating": {"$first": "$rating"}
                    }
                },
                {"$sort": {"co2e": -1}}
            ]
        ))
        return products

    def get_product(self, product_id: str) -> list:
        res = self.db.products.aggregate([
            {"$match": {"savior_id": self.savior_id, "product_id": product_id}},
            {
                "$group": {
                    "_id": "$stage",
                    "co2e": {"$sum": "$co2e"},
                    "keywords": {"$first": "$keywords"},
                    "published": {"$first": "$published"},
                    "last_updated": {"$first": "$created"},
                    "name": {"$first": "$name"},
                    "product_id": {"$first": "$product_id"},
                    "unit_types": {"$first": "$unit_types"},
                    "activity": {"$first": "$activity"},
                    "stars": {"$first": "$stars"},
                    "processes": {"$push": {
                    "_id": "$_id",
                    "activity": "$activity",
                    "activity_id": "$activity_id",
                    "activity_unit": "$activity_unit",
                    "activity_unit_type": "$activity_unit_type",
                    "activity_value": "$activity_value",
                    "co2e": "$co2e"
                    }}
                }
            },
            {"$group": {
                "_id": None, 
                "stages": {
                    "$push": {
                        "co2e": {"$sum": "$processes.co2e"},
                        "co2e_avoided": {"$sum": "$processes.co2e_avoided"},
                        "num_processes": {"$size": "$processes"},
                        "stage": "$_id",
                        "processes": "$processes",
                        "last_updated": "$last_updated",
                    }
                },
                "co2e": {"$sum": "$co2e"},
                "published": {"$first": "$published"},
                "unit_types": {"$first": "$unit_types"},
                "product_id": {"$first": "$product_id"},
                "activity": {"$first": "$activity"},
                "co2e_avoided": {"$sum": "$co2e_avoided"},
                "name": {"$first": "$name"},
                "stars": {"$first": "$stars"},
                "keywords": {"$first": "$keywords"}
            }
            }
        ])
        return res.next() if res.alive else {}
    def handle_product_processes(
        self, 
        process_update: dict, 
        id: str | None = None, 
        calculate_emissions: bool = True
    ) -> str:
        """This edits a partners product and by default 
        will calculate new emissions of the edit to write to the database
        """
        emissions_calculation = {}
        if calculate_emissions:
            print("CALCULATING")
            # emissions_calculation = self.calculate(
            #     activity_id=process_update["activity_id"],
            #     activity=process_update["activity"],
            #     activity_value=process_update["activity_value"],
            #     activity_unit=process_update["activity_unit"],
            #     activity_unit_type=process_update["activity_unit_type"]
            # )
            import random 
            emissions_calculation = {
                "co2e": random.randint(0, 20)
            }
        print("P UPDATE", process_update, "ID", id)
        process_update["published"] = False
        process_update = self._get_insert({**process_update, **emissions_calculation})
        if id:
            return self.db.products.replace_one(
                {"_id": ObjectId(id)}, process_update, upsert=True
            ).upserted_id
        else:
            process_update["stars"] = []
            return self.db.products.insert_one(process_update)
            
    # def create_factor(self, factor_document: dict, update_product: str = "") -> dict:
    #     insert = super().create_factor(factor_document)
    #     print(update_product)
    #     if update_product:
    #         print("UPDATTTINGG", update_product)
    #         print(factor_document, "FACTOR DOC")
    #         activity = factor_document["activity"]
    #         self.products.update_many(
    #             {"product_id": update_product},
    #             {
    #                 "$set": {
    #                     "activity_id": activity, 
    #                     "name": activity, 
    #                     "keywords": factor_document["keywords"]
    #                 },
    #             }
    #         )
    #     return insert 
    
    def calculate_file_emissions(self, data: list[dict]) -> bool:
        """Batch calculation of emissions of uploaded file rows"""
        calculations = self.ghg_calculator.calculate_batches(
                data, savior_id=self.savior_id, return_replacements=True
            )
        return self.db.logs.bulk_write(calculations).acknowledged
    
    def publish_product(self, product: dict) -> bool:
        product.pop("published", False)
        super().create_factor(factor_document=product)
        product["published"] = True
        product_id = product["product_id"]
        product["stars"] = self.db.stars.count_documents({"_id": product_id})
        product.pop("co2e", 0)
        product.pop("activity")
        return self.db.products.update_many(
            {"product_id": product_id}, {"$set": product}
        ).acknowledged
        
    def unpublish_product(self, product_id: str) -> bool:
        self.emission_factors.delete_one(
            {"savior_id": self.savior_id, "product_id": product_id}
        )
        return self.db.products.update_many(
            {"product_id": product_id}, {"$set": {"published": False}}
        ).acknowledged
        
        
            
        