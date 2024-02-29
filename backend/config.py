from dataclasses import dataclass
from pathlib import Path
from dotenv import load_dotenv
import os 

load_dotenv()

@dataclass(slots=True)
class Config:
    greenhouse_gasses = ["co2", "n2o", "ch4"]
    data_dir = Path.cwd().parent.parent / "data"
    api_data_version = os.environ.get("API_DATA_VERSION")