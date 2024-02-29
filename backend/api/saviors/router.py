from flask import Blueprint

bp = Blueprint("saviors", __name__, url_prefix="/saviors")

import api.saviors.routes

