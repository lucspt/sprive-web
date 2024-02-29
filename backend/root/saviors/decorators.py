from typing import Callable
from flask_jwt_extended import get_jwt, get_jwt_identity, verify_jwt_in_request
from app import send 
from root.saviors.partner import Partner
from root.saviors.user import User 
from functools import wraps

def savior_route(func: Callable) -> Callable:
    """this wraps a route, verifies the jwt header, 
    and passes a `Savior` class to it
    """
    @wraps(func)
    def _wrapper(*args, **kwargs):
        try: 
            verify_jwt_in_request()
            savior_type = get_jwt()["savior_type"]
            savior_id = get_jwt_identity()
            print(savior_id)
        except Exception as e:
            return send(content=e, status=401)
        if savior_type == "partners":
            savior = Partner(savior_id=savior_id)
        elif savior_type == "users":
            savior = User(savior_id=savior_id)
        return func(savior, *args, **kwargs)
    return _wrapper
    
        