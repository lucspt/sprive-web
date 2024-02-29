import secrets
import json
from datetime import timedelta
from flask_cors import CORS
from flask import Flask, make_response, Response
from flask_jwt_extended import JWTManager, jwt_required
from flask_mail import Mail
from queues.celery_app import celery_init_app

"https://mannharleen.github.io/2020-04-10-handling-jwt-securely-part-2/"

def send(status: int, **kwargs) -> Response:
    return make_response(
        json.dumps({**kwargs, "ok": status < 400, "status": status}, default=str), 
        status
    )

# mail = Mail()

def create_app() -> Flask:

    app = Flask(__name__)
    # mail.init_app(app)
    UPLOAD_FOLDER = "plots"
    app.config["SECRET_KEY"] = secrets.token_hex()
    app.config["JWT_SECRET_KEY"] = "secret" 
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=5)
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_COOKIE_CSRF_PROTECT"] = True
    app.config["JWT_COOKIE_SECURE"] = False #TODO: CHANGE THIS TO TRUE  
    app.config["JWT_CSRF_METHODS"] = ["GET", "POST", "PUT", "PATCH", "DELETE"]
    app.config["JWT_COOKIE_DOMAIN"] = "localhost"
    app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
    JWTManager(app)
    CORS(app, supports_credentials=True)
    # app.config["CELERY"] = {
    #     "broker": "pyamqp://guest@localhost//",
    #     "result_backend": "mongodb://localhost:27017/celery",
    #     "task_ignore_result": True
    # }
    # celery_init_app(app)

    from api.saviors.router import bp as saviors_bp
    app.register_blueprint(saviors_bp, url_prefix="/saviors")
    
    from api.factors.router import bp as factors_bp
    app.register_blueprint(factors_bp, url_prefix="/factors")

    from api.main.router import bp as base_bp 
    app.register_blueprint(base_bp, url_prefix="/")


    @app.route("/tester")
    @jwt_required()
    def test():
        return send(content="hey", status=200)
    return app

