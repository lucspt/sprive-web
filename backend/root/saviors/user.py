from datetime import datetime
from numbers import Number
from root.saviors.savior import Savior

class User(Savior):
    def __init__(self, savior_id: str):
        super().__init__(savior_id=savior_id, savior_type="users")
        
    def sum_emissions(self, since_date: datetime | None = None) -> Number:
        return super().sum_emissions(since_date or self.savior["emission_frequency"])

        
    
    
        
        