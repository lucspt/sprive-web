from flask import request, Response
from api.factors.router import bp 
from root.saviors.decorators import savior_route
from root.saviors.user import User
from root.saviors.partner import Partner
from app import send
import pymongo 


@bp.route("/", methods=["GET"], strict_slashes=False)
@savior_route
def factors(savior: User | Partner) -> Response:
    try:
        search_queries = request.args.to_dict()
        if "activity" in search_queries: #TODO: do we need get and pop?
            search_queries["$text"] = {"$search": search_queries.pop("activity")}
        limit = int(search_queries.pop("limit", 0))
        skip = int(search_queries.pop("skip", 0))
        emission_factors = savior.emission_factors
        if search_queries.pop("saved", False):
            search_queries["saved_by"] = savior.savior_id
        result = emission_factors.aggregate([
            {
                "$match": {
                    "$or": [
                        {"savior_id": savior.savior_id}, 
                        {"source": {"$ne": "partners"}}
                    ],
                    **search_queries
                }
            }, 
            {
                "$project": {
                    "embeddings": 0,
                }
            },
            {"$skip": skip},
            {"$limit": limit}
        ])
        distinct = emission_factors.distinct
        possibilities = {}
        for query_field in ["activity", "unit_types", "region", "source"]:
            possibilities[query_field] = distinct(query_field)
        max_results = emission_factors.count_documents(search_queries)
        return send(
            status=200, 
            content=list(result), 
            possibilities=possibilities, 
            max_results=max_results
        )
    except Exception as e:
        return send(content=e, status=400)

        
@bp.route("/calculations", methods=["POST"])
@savior_route
def calculate_emissions(savior: Partner | User) -> Response:
    try:
        json = request.json 
        is_batched = request.json.get("batched", False)
        if is_batched:
            results = savior.ghg_calculator.calculate_batches(json.get("data"))
        else:
            results = savior.ghg_calculator(**json)
        response = send(status=200, content=results)
    except Exception as e:
        response = send(status=400, content=e)
    return response

@bp.route("/<string:resource>/possibilities", methods=["GET"])
def get_possibilities(resource: str) -> Response:
    try:
        response, status = pymongo.MongoClient().spt.emission_factors.distinct(
            resource
        ), 200 
    except Exception as e:
        response, status = e, 400
    return send(content=response, status=status)