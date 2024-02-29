from flask import Blueprint 

bp = Blueprint("factors", __name__, url_prefix="/factors")

import api.factors.routes