from flask import request, Response, Request
from typing import Literal
from app import send
from api.saviors.router import bp
import pandas as pd 
import numpy as np
from flask_mail import Message
from bson import ObjectId
import sys 
from celery.result import AsyncResult
from root.saviors.decorators import savior_route
from root.saviors.partner import Partner
from root.saviors.user import User

@bp.route("/dashboard/<string:data>", methods=["GET"])
@savior_route
def get_dashboard(
    savior: Partner | User,
    data: Literal[
        "overview", 
        "products",
        "pledges",
        "stats",
        "suppliers"
    ],
) -> Response:
    """returns dashboard section data"""
    try:
        response = savior.dashboards[data]()
        return send(content=response, data_type=data, status=200)
    except Exception as e:
        return send(content=e, status=400, data_type=None)
    
@bp.route("/data", methods=["POST"])
@savior_route 
def handle_data(savior: Partner | User) -> Response:
    """Access to db queries"""
    try: 
        json = request.json
        filters = json.get("filters", {})
        if isinstance(filters, list):
            if "savior_id" in filters[0]:
                return send(content="Cannot access that query field", status=401)
            else:
                res, status = savior.get_data(**json), 200
        elif "savior_id" in filters: 
            return send(content="Cannot access that query field", status=401)
        else:
            res, status = savior.get_data(**json), 200
    except Exception as e:
        res, status = e, 400
    return send(content=res, status=status)

# @bp.route("/plots", methods=["POST"])
# @savior_route
# def personal_plot(savior: Partner | User) -> Response:
#     try:
#         res, status = savior.personal_plot(**request.json), 200  
#     except Exception as e:
#         res, status = e, 400
#     return send(content=res, status=status)    
          
def _upload_data(savior: Partner, request: Request) -> Response:
    
    try:
        print(request.files)
        file = request.files.get("file[]")
        filename = file.filename
        file_extension = filename.partition(".")[-1]
        if file_extension == "csv":
            data = pd.read_csv(file)
        elif file_extension in ["xls", "xlsx"]:
            data = pd.read_excel(file)
        else: 
            return send(content="Invalid file type", status=400)
        data.loc[:, "source_file"] = [
            {"name": filename, "size": sys.getsizeof(file), "processed": False}
        ] * len(data)
        documents = data.replace({np.nan: None}).to_dict("records")
        savior.insert_logs(logs=documents)
        return send(content={"filename": file.filename}, status=200)
    except Exception as e:
        return send(content=e, status=400)

@bp.route("/files/<string:file_id>", methods=["GET"])
@bp.route("/files", methods=["GET", "POST", "PUT"])
@savior_route
def files(savior: Partner, file_id: str = None) -> Response:
    """Upload, view uploaded, and calculate the emissions of files"""
    try:
        method = request.method 
        if method == "GET":
            processing_only = request.args.get("processing-only", False)
            response, status = savior.get_files(
                file=file_id, processing_only=processing_only
            ), 200
            print(response)
        elif method == "POST":
            print("RIGHT HEREEE")
            return _upload_data(savior=savior, request=request)
        elif method == "PUT":
            response, status = savior.calculate_file_emissions(request.json["data"]), 200
    except Exception as e:
        response, status = e, 400
    return send(content=response, status=status)
    


@bp.route("/pledges", methods=["POST"])
@savior_route
def create_pledge(savior: Partner | User) -> Response:
    try:
        pledge_info = request.json
        response, is_recurring = savior.make_pledge(pledge_document=pledge_info)
        if is_recurring:
            print("START CELERY BEAT HERE")
        status = 200
    except Exception as e:
        response, status = e, 400
    return send(content=response, status=status)

@bp.route("/pledges/<string:id>", methods=["GET", "PUT"])
@savior_route
def pledge(savior: User | Partner, id: str):
    try:
        method = request.method 
        id = ObjectId(id)
        if method ==  "GET":
            response = savior.db.pledges.find_one({"_id": id})
        elif method == "PUT":
            response = savior.db.pledges.update_one(
                {"_id": id}, {"$set": request.json}
            ).acknowledged
        status = 200
    except Exception as e:
        response, status = e, 400
    return send(content=response, status=status)
    

@bp.route("/suppliers", methods=["GET", "POST", "PUT"])
@savior_route
def suppliers(savior: Partner, id: str | None = None) -> Response:
    """Get suppliers of a savior, add new suppliers or contact a supplier by email"""
    try:
        method = request.method 
        if method == "PUT":
            response = savior.add_supplier(request.json)
        status = 200
    except Exception as e:
        response, status = e, 400
    return send(content=response, status=status)

@bp.route("/suppliers/<string:id>")
@savior_route
def supplier(savior: Partner, id: str) -> Response:
    try:
        method = request.method 
        if method == "GET":
            response = savior.db.suppliers.find_one({"_id": ObjectId(id)})
        elif method == "POST":
            # send mail
            supplier = None
            msg = Message( 
                subject="Carbon footprint management",
                recipients=supplier["email"]
            )
            # from app import mail 
            # mail.send(msg)
        status = 200
    except Exception as e:
        response, status = e, 400
    return send(content=response, status=status)

@bp.route("/products", methods=["POST", "GET", "PUT"])
@savior_route
def products(savior: Partner) -> Response:
    """The product stages can get bulky, so even though we are duplicating data, 
    we have chosen to use references to savior_id instead of embedding documents"""
    try:
        method = request.method 
        if method == "GET":
            response = savior._products
        elif method == "POST": 
            product_info = request.json 
            if not product_info.keys() & {"name", "productId", "keywords"}:
                raise Exception("A name, id, and keywords are required when creating a product")
            insert = savior._get_insert(product_info)
            response = savior.db.products.insert_one(insert).inserted_id
        elif method == "PUT":
            response = ObjectId() 
            # for when a product is been created, and has no stages yet, 
            # we use this endpoint to get an id
        status = 200 
    except Exception as e:
        response, status = e, 400
    return send(content=response, status=status)

@bp.route("/products/<string:id>", methods=["GET", "DELETE", "PATCH"])
@savior_route
def product(savior: Partner, id: str) -> Response:
    try:
        method = request.method 
        if method == "GET": 
            response = savior.get_product(product_id=id) 
        elif method == "DELETE":
            response = savior.db.products.delete_many(
                {"product_id": id}
            ).deleted_count
        elif method == "PATCH":
            update = request.json
            name = update.get("name")
            if name:
                name = name.strip()
                update["name"] = name
                update["activity"] = name
            kwds = update.get("keywords")
            if kwds:
                update["keywords"] = kwds.strip()
            response = savior.db.products.update_many(
                {"product_id": id}, {"$set": update}
            ).acknowledged
        status = 200
    except Exception as e:
        response, status = e, 400
    return send(content=response, status=status)


@bp.route("/products/processes", methods=["POST"])
@bp.route("/products/processes/<string:id>", methods=["DELETE", "POST", "PUT"])
@savior_route
def product_processes(savior: Partner, id: str | None = None) -> Response:
    try:
        method = request.method
        if method == "DELETE":
            response = savior.db.products.delete_one(
                {"_id": ObjectId(id)}
            ).acknowledged
        elif method == "PUT": 
            print(id, "IDDDD")
            process_update = request.json 
            response = savior.handle_product_processes(
                id=id, 
                process_update=process_update, 
                calculate_emissions=process_update.pop("calculate_emissions", False)
            )         
        elif method == "POST":
            response = savior.handle_product_processes(
                process_update=request.json
            )
        status = 200
    except Exception as e:
        response, status = e, 400
    return send(content=response, status=status)

@bp.route("/products/publishings", methods=["POST"])
@bp.route("/products/publishings/<string:id>", methods=["DELETE"])
@savior_route
def handle_product_publishings(savior: Partner, id: str | None = None) -> Response:
    """this endpoint handles publishing and unpublishing products"""
    try:
        method = request.method 
        if method == "POST":
            response, status = savior.publish_product(
                product=request.json
            ), 200
        elif method == "DELETE":
            response, status = savior.unpublish_product(product_id=id), 200
    except Exception as e:
        response, status = e, 400
    return send(content=response, status=status)
    

@bp.route("/emissions", methods=["GET"])
@savior_route
def emissions(savior: User | Partner): 
    """get emissions logs of a savior"""
    try:
        response, status = savior.emissions_history(), 200
    except Exception as e:
        response, status = e, 400
    return send(content=response, status=status)


@bp.route("/tasks/<string:task_id>", methods=["GET", "PATCH", "PUT", "DELETE"]) 
@bp.route("/tasks", methods=["GET", "POST", "DELETE"])
@savior_route
def tasks(savior: User | Partner, task_id: str = None) -> Response:
    """get and create new tasks / todos"""
    try:
        tasks = savior.db.tasks
        method = request.method
        if method == "GET":
            if task_id:
                res = list(tasks.find_one({"_id": ObjectId(task_id)}))
            else:
                savior_id = savior.savior_id
                res = {
                    "pending": tasks.count_documents({
                        "savior_id": savior_id, "status": "in progress"
                    }),
                    "tasks": list(
                        tasks.find(
                            {"savior_id": savior_id}, 
                            sort=[("status", -1), ("created", -1)]
                        )
                    )
                }
        elif method == "PUT":
            json = request.json 
            json.pop("_id")
            res = tasks.update_one(
            {"_id": ObjectId(task_id)}, {"$set": request.json}
        )
        elif method == "POST":
            json = request.json 
            json.pop("_id")
            savior = savior 
            res = savior._get_insert(
                {**request.json, "status": "in progress"}
            )
            tasks.insert_one(res)
        elif method == "PATCH": 
            res = tasks.update_one(
                {"_id": ObjectId(task_id)},
                {"$set": {"status": "complete"}}
            )
        elif method == "DELETE":
            res = tasks.delete_many({"_id": ObjectId(task_id)}).deleted_count
        status = 200
    except Exception as e: 
        res, status = e, 400
    return send(content=res, status=status)
 
@bp.route("/factors", methods=["POST"])
@savior_route
def create_emission_factor(savior: User | Partner) -> Response:
    try:
        method = request.method 
        if method == "POST":
            response, status = savior.create_factor(
                factor_document=request.json 
            ), 200
    except Exception as e:
        response, status = e, 400
    return send(status=status, content=response)

@bp.delete("/factors/<string:factor_id>")
@savior_route
def delete_factor(savior: Partner | User, factor_id: str) -> Response:
    try:
        response, status = savior.emission_factors.delete_one(
            {"savior_id": savior.savior_id, "resource_id": factor_id}
        ), 200
    except Exception as e:
        response, status = e, 400
    return send(status=status, content=response)
    
@bp.route("/factors/bookmarks/<string:factor_id>", methods=["DELETE", "PATCH"])
@savior_route
def handle_emission_factor(savior: User | Partner, factor_id: str) -> Response:
    try:
        actions = {"PATCH": "$addToSet", "DELETE": "$pull"}
        accumulator = actions[request.method]
        saved = savior.handle_emission_factor(
            factor_id=factor_id, accumulator=accumulator
        )
        return send(status=200, content=saved)
    except Exception as e:
        return send(status=500, content=e)
    
from queues.tasks import add    
@bp.route("/test-celery", methods=["POST"])
def test_celery():
    try: 
        json = request.json 
        a, b = json["a"], json["b"]
        result = add.delay(a, b)
        return send(content=result.id, status=200)
    except Exception as e:
        return send(content=e, status=400)
    
@bp.get("/test-celery/<string:id>")
def get_celery(id: str):
    result = AsyncResult(id)
    content = {
        "ready": result.ready(),
        "sucessful": result.successful(),
        "value": result.get() if result.ready() else None
    }
    return send(content=content, status=200)
    