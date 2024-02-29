from datetime import datetime, timezone
import pymongo
from typing import Literal
from numbers import Number
from root.emissions import GHGCalculator
from bson import ObjectId
from openai import OpenAI

class Savior:
    __slots__ = (
        "savior_id", 
        "db",
        "ghg_calculator",
        "emission_factors",
        "dashboards",
        "savior_type",
        "client",
    )
    
    def __init__(self, savior_id: str, savior_type: str):
        client = pymongo.MongoClient()
        db, savior_id = client.spt, ObjectId(savior_id)
        self.db = db
        savior = self.verify_savior_id(savior_id=savior_id, saviors=db.saviors)
        self.dashboards = {
            "emissions": lambda: self.get_co2e(db.logs),
            "pledges": lambda: self._pledges,
            "overview": self.get_overview,
            "stats": lambda: self.current_stats
        }
        self.savior_type = savior_type
        self.savior_id = savior_id
        self.emission_factors = db.emission_factors
        self.ghg_calculator = GHGCalculator(region=savior["region"])
        self.client = OpenAI()
    
    @property
    def savior(self):
        return self.saviors.find_one({"_id": self.savior_id})
    
    def verify_savior_id(
        self, savior_id: str, saviors=pymongo.collection.Collection
    ) -> None:
        savior = saviors.find_one({"_id": savior_id})
        if not savior:
            print("not found")
            raise ValueError("No such savior")
        self.savior_id = savior_id
        return savior
    
    def _get_insert(self, document: dict) -> dict:
        return {
            **document,
            "created": datetime.now(tz=timezone.utc),
            "savior_id": self.savior_id,
        }
        
        
    Collection = pymongo.collection.Collection 
    def get_co2e(self, collection: Collection, group: str = None,) -> Number:
        """Get a sum of co2e from a savior_id and collection"""
        match = {"savior_id": self.savior_id}
        if collection.name == "logs":
            match.update({"co2e": {"$exists": True}})
        group = f"${group}" if group else group
        pipeline = [
            {"$match": match},
            {"$group": {"_id": group, "co2e": {"$sum": "$co2e"}}}
        ]
        if not group:
            result = collection.aggregate(pipeline)
            result = round(result.next()["co2e"], 2) if result.alive else 0
        else:
            result = list(
                collection.aggregate(pipeline + [
                    {"$sort": {"co2e": -1}}, {"$limit": 5}
                ])
            )
        return result
        
    
    def get_pie_chart(self, group: Literal["activity", "reason"] = "activity") -> str:
        """Pie chart visualization of emissions causes 
        
        Args:
            group: what key to use for grouping when calculating emissions
        """
        group = f"${group}" if group else group
        result = list(self.db.logs.aggregate([
            {"$match": {"savior_id": self.savior_id},},
            {"$group": {"_id": group, "emissions": {"$sum": "$co2e"}}},
            {"$limit": 5}
        ]))
        
        return {
            "co2e": [x["emissions"] for x in result],
            "labels": [x["_id"] for x in result],
            "description": f"emissions grouped by {group}"
        }
    
    @property   
    def current_stats(self): 
        savior_id = self.savior_id
        pledges = self.db.pledges 
        pledge_count = pledges.count_documents({"savior_id": savior_id})
        active_pledges = pledges.count_documents(
            {"savior_id": savior_id, "status": "active"}
        )
        _sort = lambda to_sort: sorted(to_sort, key=lambda x: x["co2e"])
        emissions_grouped =_sort(self.get_co2e(self.db.logs, group="category"))
        pledges_grouped = _sort(self.get_co2e(pledges, group="category"))
        def _get_pcts(groups: list):
            total = sum(x["co2e"] for x in groups)
            for x in groups:
                co2e = x["co2e"]
                x["percentage"] = round((co2e / total) * 100, 2) if co2e else None
            return {"total_co2e": total, "co2e_per_category": groups}
        return {  
                "emissions": _get_pcts(emissions_grouped),
                "pledges": {
                    "active": active_pledges,
                    "count": pledge_count,
                    **_get_pcts(pledges_grouped)
                }
            }
    
    def get_overview(self) -> dict:
        """This is what populates the overview section of the dashboard"""
        stats = self.current_stats
        overview = {**stats, "pie_chart": self.get_pie_chart()}
        
        return overview
    
    @property
    def _pledges(self):
        return list(self.db.pledges.find({"savior_id": self.savior_id}))
    
    def make_pledge(self, pledge_document):
        unit_type = pledge_document["unit_type"]
        unit, value =  pledge_document["unit"], pledge_document["value"]
        # calculation = self.calculate(
        #     activity_id=pledge_document["activity"],
        #     value=value,
        #     unit=unit,
        #     unit_type=unit_type
        # )
        calculation = {"co2e": 10}
        now = datetime.now(tz=timezone.utc)
        pledge_document["name"] = pledge_document.pop("name").lower()
        co2e = calculation["co2e"]
        if pledge_document["recurring"]:
            pledge_document["status"] = "active"
        pledge = {
            **pledge_document,
            "last_updated": now,
            "created": now,
            "co2e": co2e,
            "co2e_factor": co2e,
            "stars": [],
            "savior_id": self.savior_id,
        }
        return self.db.pledges.insert_one(pledge).inserted_id, pledge["recurring"]
    
    def calculate(
        self,
        activity_id: str,
        activity_value: Number,
        activity_unit: str,
        activity_unit_type: str,
        activity: str | None = None
    ) -> dict:
        "emissions calculation"
        
        emissions = self.ghg_calculator(
            activity_id=activity_id,
            value=activity_value,
            unit=activity_unit,
            unit_type=activity_unit_type
        )
        if activity: emissions["activity"] = activity
        
        return {
            **emissions, 
            "activity_unit_type": activity_unit_type,
            "activity_unit": activity_unit,
            "activity_value": activity_value,
            "activity_id": activity_id,
            "tool_call_query": None, #this comes from amulet only
        }
        
    def insert_logs(self, logs: dict | list) -> list:
        if isinstance(logs, dict): logs = [logs]
        documents = [self._get_insert(log) for log in logs]
        inserts = self.db.logs.insert_many(documents)
        return inserts.inserted_ids
    
    def get_data(
        self, 
        query_type: Literal["aggregate", "find"],
        collection: str,
        filters: dict | list = {},
        correct_queries: bool = False
    ) -> list :
        print(filters, "start")
        _collection = self.db[collection]
        required_filters = {"savior_id": self.savior_id}
        if query_type == "find":
            if collection == "logs":
                required_filters.update(
                    {"co2e": {"$exists": True, **filters.get("co2e", {})}}
                )
                print("FIND UPDATED", required_filters)
            filters.update(required_filters)
            print(filters, "find")
            return list(_collection.find(
                {"savior_id": self.savior_id, **filters},
            ))
        elif query_type == "aggregate":
            entrypoint = filters[0]
            if "$match" in entrypoint:
                match = entrypoint["$match"]
                if collection == "logs":
                    required_filters.update(
                        {"co2e": {"$exists": True, **match.get("co2e", {})}}
                    )
                match.update(required_filters)
                if "created" in match:
                    date_range = match["created"]
                    for accumulator, date in entrypoint["$match"]["created"].items():
                        date_range[accumulator] = datetime.strptime(date, "%Y-%m-%dT%H:%M:%S.%f%z")
                        match["created"] = date_range
            else:
                filters = [{"$match": required_filters}] + filters
            print(filters, "FILTERS")
            return list(_collection.aggregate(filters))
        else: 
            raise ValueError("query_type must be one of aggregate or find")
        
    def handle_emission_factor(
        self,
        factor_id: str,
        accumulator: str
    ) -> str:
        """Add or save an emission factor"""
        update = {accumulator: {"saved_by": self.savior_id}}
        self.emission_factors.update_one(
            {"_id": ObjectId(factor_id)}, update, upsert=True
        )
        return factor_id
        
    def create_factor(self, factor_document: dict) -> bool:
        # embeddings = self.client.embeddings.create(
        #     model="text-embedding-3-large",
        #     input=factor_document["keywords"]
        # ).text TODO: embeddings for custom emission factors and products
        embeddings = self.client.embeddings.create(
            input=factor_document["keywords"],
            model="text-embedding-3-small"
        )
        savior_id = self.savior_id
        factor_document["unit_types"] = [factor_document["unit_types"]]
        insert = {
            **factor_document,
            "embeddings": embeddings.data[0].embedding,
            "savior_id": savior_id,
            "source": self.savior_type,
            "saved_by": [savior_id],
            "last_updated": datetime.now(tz=timezone.utc),
            "created": datetime.now(tz=timezone.utc)
        }
        return self.emission_factors.insert_one(insert).acknowledged

    def emissions_history(self, filters: dict = {}):
        if "savior_id" in filters:
            raise ValueError("Cannot access that query field")
        return list(self.db.logs.find(
            {"savior_id": self.savior_id, "co2e": {"$exists": True}}, sort=[("created", -1)]
        ))
    
    def handle_stars(
        self,
        id: str,
        resource: Literal["pledges", "products", "saviors"],
        delete: bool = False
    ) -> bool:
        """this is for starring and unstarring pledges"""
        star = {
            "savior_id": self.savior_id,
            "_id": id,
            "resource": resource
            }
        if resource == "products": 
            update_match = {"product_id": id}
        else: 
            update_match = {"_id": id}
        if delete:
            self.db[resource].update_many(
                update_match, {"$inc": {"stars": -1}}
            )
            return self.db.stars.delete_one(star).acknowledged
        else:
            self.db[resource].update_many(
                update_match, {"$inc": {"stars": 1}}
            )
            return self.db.stars.insert_one(star).acknowledged