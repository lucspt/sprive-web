import pandas as pd 
from root.emissions import GHGCalculator 


data = [{
    "activity_id": "consumer_goods-type_sugar",
    "unit": "usd",
    "unit_type": "money",
    "value": 10,
}]

calc = GHGCalculator(region="US")

print(calc.calculate_batches(data))