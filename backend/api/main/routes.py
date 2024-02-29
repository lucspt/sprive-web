from api.main.router import bp 
import pymongo 
from bson import ObjectId
from flask import request, Response
from app import send 
from flask_jwt_extended import create_access_token, set_access_cookies 
from datetime import datetime, timezone
from root.saviors.decorators import savior_route
from root.saviors.partner import Partner
from root.saviors.user import User
import pandas as pd 

@bp.post("/saviors")
def create_account() -> Response:
    try:
        req = request.json    
        name, savior_type = req["username"], req["savior_type"]
        now = datetime.now(tz=timezone.utc)
        account = {
            "username": name, 
            "joined": now,
            "region": req["region"],
            "password": req["password"],
            "currency": req.get("currency", "usd") 
            #also figure out how to map a region to a currency, we have a df for it but needs more looking into as well
        }
        db = pymongo.MongoClient().spt 
        if savior_type == "partners":
            account["company_name"] = req["company_name"]
            db.tasks.insert_one({
                "created": now, 
                "name": "first task",
                "category": "data",
                "description": "upload your first file and calculate emissions to start your journey",
                "status": "in progress",
                "savior_id": _id,
                "assignees": []
            })
        _id = db.saviors.insert_one(
            account
        ).inserted_id
        response, status = _login(str(_id), savior_type, name), 200
    except Exception as e:
        response, status = e, 400 
    return send(content=response, status=status)

def get_partner_card(db: pymongo.database.Database, id: str | None = None):
    """this provides the data for a partner card 
    that you can access through the ecosystem page"""
    db = pymongo.MongoClient().spt
    partner_card = db.saviors.aggregate(
        [
            {"$match": {"_id": id}},
            {"$lookup": {
                    "from": "pledges",
                    "foreignField": "savior_id",
                    "localField": "_id",
                    "as": "pledges"
                }
            },
            {"$unwind": "$pledges"},
            {
                "$lookup": {
                    "from": "stars",
                    "foreignField": "_id",
                    "localField": "pledges._id",
                    "as": "pledges.stars",
                }
            },
            {"$group": {
                    "_id": None,
                    "name": {"$first": "$username",},
                    "pledges": {"$push": {   
                        "name": "$pledges.name",
                        "_id": "$pledges._id",
                        "description": "$pledges.description",
                        "image": "$pledges.image",
                        "started": "$pledges.created",
                        "co2e": "$pledges.co2e",
                        "status": "$pledges.status",
                        "recurring": "$pledges.recurring",
                        "frequency": "$pledges.frequency",
                        "frequency_value": "$pledges.frequency_value",
                        "stars": "$pledges.stars.savior_id"
                        },
                    },
                    "emissions_saved": {"$sum": "$pledges.co2e"},
                }
            }
        ]
    ).next()
    partner_card["products"] = list(
        db.emission_factors.find({"savior_id": id}, {"embeddings": 0})
    )
    partner_card["_id"] = id
    return partner_card

@bp.route("/saviors", strict_slashes=False, methods=["GET"])
@bp.route("/saviors/<string:id>", strict_slashes=False, methods=["GET"])
def get_saviors(id: str | None = None) -> Response:
    try :
        savior_type = request.args.get("type")
        db = pymongo.MongoClient().spt
        if savior_type == "partners":
            if id:
                response = get_partner_card(db, id=ObjectId(id))
            else:
                response = list(
                    db.pledges.aggregate([
                        {
                            "$group": {
                                "_id": "$savior_id", 
                                "emissions_saved": {"$sum": "$co2e"},
                            }
                        },
                        {
                            "$lookup": {
                                "from": "saviors",
                                "localField": "_id",
                                "foreignField": "_id",
                                "as": "savior"
                            }
                        },
                        {"$unwind": "$savior"},
                        {
                            "$project": {
                                "name": "$savior.savior_id",
                                "emissions_saved": 1,
                                "logo": "$savior.logo",
                                "joined": "$savior.joined",
                            }
                        }
                    ])
                )
        elif savior_type == "users":
            pass 
        else:
            raise Exception("invalid savior type")
        status = 200
    except Exception as e:
        response, status = e, 400
    return send(content=response, status=status)

@bp.route("/saviors/<string:id>/stars", methods=["POST", "DELETE"])
@savior_route
def star_savior(savior: User | Partner, id: str) -> Response:
    try:
        response, status = savior.handle_stars(
            id=ObjectId(id),
            resource="saviors",
            delete=request.method == "DELETE"
        ), 200
    except Exception as e:
        response, status = e, 400
    return send(content=response, status=status)

def _login(savior_id: str, savior_type: str, name: str) -> dict:
        access_token = create_access_token(
            identity=savior_id, 
            additional_claims={"savior_type": savior_type}
        )
        return {
            "username": name, 
            "like_resource": savior_id,
            "savior_type": savior_type
        }, access_token
    

@bp.post("/login")
def login() -> Response:
    try:
        json = request.json 
        savior_type = json["savior_type"]
        match_filters = {"username": json["username"], "type": savior_type}
        # if savior_type == "partners":
        #     match_filters["company_name"] = json["company_name"]
        username_match = pymongo.MongoClient().spt.saviors.find_one(match_filters)
        if not username_match:
            raise Exception("Could not find an account with that username")
        elif json["password"] == username_match["password"]:
            response, jwt = _login(str(username_match["_id"]), savior_type, username_match["username"])
        else: 
            raise Exception("The given password and username do not match")
        response = send(content=response, status=200)
        set_access_cookies(response, jwt)
        return response 
    except Exception as e:
        return send(content=e, status=400)
    
@bp.route("/pledges/<string:id>/stars", methods=["POST", "DELETE"])
@savior_route 
def star_pledge(savior: Partner | User, id: str) -> Response:
    """Stars for pledges"""
    try:
        response, status = savior.handle_stars(
            id=ObjectId(id),
            resource="pledges",
            delete=request.method == "DELETE"
        ), 200
    except Exception as e:
        response, status = e, 400
    return send(content=response, status=status)

@bp.route("/products/<string:id>/stars", methods=["POST", "DELETE"])
@savior_route
def star_product(savior: Partner | User, id: str) -> Response:
    try:
        response, status = savior.handle_stars(
            id=id, 
            resource="products",
            delete=request.method == "DELETE"
        ), 200
    except Exception as e:
        response, status = e, 400
    return send(content=response, status=status)
    
@bp.get("/products")
@bp.get("/products/<string:id>")
def get_products(id: str | None = None) -> Response:
    """This endpoint gives access to published products, 
    through the emission factors collection
    """
    try:
        products = pymongo.MongoClient().spt.emission_factors
        pipeline = [
            {"$match": {"product_id": {"$exists": True}}},
            {
                "$lookup": {
                    "from": "stars",
                    "localField": "product_id",
                    "foreignField": "_id",
                    "as": "stars",
                }
            },
            {
                "$project": {
                    "name": 1,
                    "co2e": 1,
                    "unit_types": 1,
                    "co2e_avoided": 1,
                    "keywords": 1,
                    "product_id": 1,
                    "rating": 1,
                    "stars": "$stars.savior_id"
                }
            },
            {"$sort": {"co2e": -1}}
        ]
        if id:
            pipeline[0]["$match"].update({"product_id": id})
            response = products.aggregate(pipeline)
            response = response.next() if response.alive else {}
        else:
            response = list(products.aggregate(pipeline))
        status = 200
    except Exception as e:
        response, status = e, 400
    return send(content=response, status=status)


@bp.get("/pledges")
def get_pledges() -> Response:
    """Pledges endpoint"""
    try:
        pledges = pymongo.MongoClient().spt.pledges
        response = list(pledges.find())
        status = 200
    except Exception as e:
        response, status = e, 400
    return send(content=response, status=status)

@bp.get("/regions/possibilities")
def possible_regions():
    """Returns the regions available when creating an account"""
    #TODO: where will we source possible regions? from emission_factors.distinct()?
    response = ["US"]
    return send(content=response, status=200)