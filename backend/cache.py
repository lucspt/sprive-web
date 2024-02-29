from typing import Any, Callable
from root.saviors.partner import Partner
from root.saviors.user import User
from flask import make_response, jsonify
from functools import wraps
from flask_jwt_extended import get_jwt, get_jwt_identity, verify_jwt_in_request
import pymongo
from root.emissions import GHGCalculator

class Cache:
    slots = (
        "emission_factors",
        "savior",
        "savior_id",
        "__dict__"
    )
    
    def __init__(self):
        client = pymongo.MongoClient()
        self.client = client
        self.emissions_factors = client.emissions.emission_factors
        self.ghg_calculator = GHGCalculator(region="US")
    
    @property 
    def savior_tools(self):
        return self.savior.tools
    
    def getmethod(self, method: str) -> Callable:
        return getattr(self.savior, method)
                
    def register(self, savior_id: str, savior_type: str) -> dict | None:
        # global cache
        # if hasattr(self, "savior_id") and self.savior_id == savior_id:
        #     if cache: cache = Cache()
        #     raise Exception("The cache is already registered")
        print("RESTARTING CACHEEEEEEEEEEEEEEEEEEE", savior_id, savior_type)
        self.savior_id = savior_id
        db = self.client[savior_type]
        if savior_type == "partners":
            self.savior = Partner(savior_id=savior_id)
            print("its a partna")
        elif savior_type == "users":
            print("its a user")
            self.savior = User(savior_id=savior_id)
            
        return db.saviors.find_one({"savior_id": savior_id})
    
    
    def requires_cache(self, func: Callable):
        @wraps(func)
        def _wrapper(*args, **kwargs):
            verify_jwt_in_request()
            if not hasattr(self, "savior"):
                try: 
                    savior_type = get_jwt()["savior_type"]
                    savior_id = get_jwt_identity()
                    self.register(savior_id, savior_type)
                except Exception as e:
                    return make_response(
                        jsonify(message="Unauthorized Request", ok=False), 401
                    )
            return func(*args, **kwargs)
        return _wrapper
        
    def __contains__(self, key: Any) -> bool:
        return key in self.__dict__           
    
    
    
cache = Cache()
# cache.register(savior_id="test", savior_type="partner")

