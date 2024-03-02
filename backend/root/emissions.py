from numbers import Number
import os, logging, requests
from config import Config
import pandas as pd
from pymongo import ReplaceOne
from bson import ObjectId
from datetime import datetime, timezone

class GHGCalculator:
    __slots__ = (
        "region",
        "estimation_endpoint",
        "search_endpoint",
        "ghgs",
        "emission_factors",
        "api_auth",
        "consumer_price_index",
        "version",
        "batch_endpoint"
    )

    def __init__(self, region: str):
        url = "https://beta4.api.climatiq.io"
        self.estimation_endpoint = f"{url}/estimate/batch"
        self.search_endpoint = f"{url}/search"
        api_key = os.environ.get("CALCULATIONS_API_KEY")
        config = Config()
        self.api_auth = {"Authorization": f"Bearer: {api_key}"}
        self.ghgs = config.greenhouse_gasses
        self.consumer_price_index = pd.read_csv(
            str(config.data_dir / "average-cpis.csv")
        )
        self.region = region
        self.version = config.api_data_version

    def calc_inflation(self, value, factor_region, factor_year) -> Number:
        """Calculate inflation for spend-based emissions"""
        cpis = self.consumer_price_index
        region = cpis[cpis["region_code"] == factor_region]
        old_cpi = next(iter(region.loc[:, str(factor_year)]))
        current_cpi = next(
            iter(
                region.loc[
                    :, str(2023)
                ]  # TODO: only have inflation data up to 2023, and how do we automate the updates of it?
            )
        )
        real = value * (old_cpi / current_cpi)
        return real

    def get_possible_queries(self, queries: dict) -> dict:
        """This endpoint returns the possibilites of stricter query combinations 
        (year, region, etc) given a set of query params already in place
        """
        return requests.get(
            url=self.search_endpoint, params=queries, headers=self.api_auth
        ).json()

    def get_best_query(self, activity_id: str) -> int:
        # TODO: consider either region fallback or year fallback parameter instead of this, especially if it's faster
        """Logic to get the most recent year available for an emission factor
        given the user's region. Falls back to latest year if the region
        doesn't have a factor
        """
        queries = {
            "activity_id": activity_id,
            "data_version": self.version,
            "region": self.region,
        }
        valid_queries = self.get_possible_queries(queries=queries)
        print(valid_queries)
        if valid_queries["total_results"] < 1:
            logging.warning(
                "No corresponding emission factor for the given region"
                f" `{self.region}` falling back to latest year"
            )
            queries.pop("region")
            valid_queries = self.get_possible_queries(queries=queries)
        best_match = max(valid_queries["results"], key=lambda x: x["year"])
        return best_match

    def format_request(
        self, activity_id: str, value: Number, unit_type: str, unit: str
    ) -> dict:
        """Get a request ready for the emissions estimation endpoint"""
        best_match = self.get_best_query(activity_id=activity_id)
        # account inflation w.r.t the emission factor's region and year
        if unit_type == "money":
            real_value = self.calc_inflation(
                value=value,
                factor_region=best_match["region"],
                factor_year=best_match["year"],
            )

        parameters = {unit_type: real_value, f"{unit_type}_unit": unit}
        data = {
            "emission_factor": {
                "id": best_match["id"],
            },
            "parameters": parameters,
        }
        return data
    
    @staticmethod
    def to_kg(
        value: Number, unit: str, conversions: dict = {
            "g": 0.001, "t": 1000, 
        }
    ) -> Number:
        """Turn the co2e value from api response into kilograms to have 
        one standard unit across all operations"""
        if unit == "kg":
            return value
        elif unit == "g":
            return value * 0.001
        elif unit == "t":
            return value * 1000

    def format_response(self, res: dict) -> dict:
        """Extract the wanted info from api response"""
        emissions = res["constituent_gases"]
        emissions = {
            "co2e": self.to_kg(res["co2e"]), 
            "co2e_unit": res["co2e_unit"],
            **{g: emissions.get(g) for g in self.ghgs}
            }
        return emissions

    # CALCULATE FOR INFLATION AND PURCHASE VS BASIC PRICE https://www.climatiq.io/docs/guides/understanding/procurement-spend-based-calculations FOR EXIOBASE

    def __call__(
        self, value: Number, activity_id: str, unit_type: str, unit: str
    ) -> dict:
        """Returns ghg emissions given an activity, 
        and a value representing the 'amount' of activity done

        Args:
            value: the numerical representation of the activity e.g 5 for 5 dollars
            activity: the activity to get the emission factor for
            unit_type: the type of unit, either money or weight 
            unit: the specific unit if unit type is not money - kg, lb, g

        Returns: The given emissions for the ghgs with available factors
        """
        request = self.format_request(
            activity_id=activity_id, value=value, unit=unit, unit_type=unit_type
        )
        res = requests.post(
            url=self.estimation_endpoint, headers=self.api_auth, json=request
        )
        print(res)
        return self.format_response(res.json())
            
    DataFrame = pd.DataFrame
    def calculate_batches(
        self, data: list[dict], savior_id: ObjectId, return_replacements: bool = False
    ) -> list[dict] | list[ReplaceOne]:
        now = datetime.now(tz=timezone.utc)
        if return_replacements:
            fields = ["activity_id", "value", "unit", "unit_type"]
            # TODO: if it's ambiguous we can pop source file 
            results = []
            import random 
            for doc in data:
                # calculation = self(**{k: v for k, v in doc.items() if k in fields})
                calculation = {"co2e": random.randint(0, 1000), "co2e_unit": "kg"}
                results.append(ReplaceOne(
                    {"_id": ObjectId(doc.pop("_id"))}, 
                    {
                        **doc, 
                        "created": now,
                        "savior_id": savior_id,
                        "co2e": calculation["co2e"],
                        "co2e_unit": calculation["co2e_unit"],
                    }
                ))
        else:
            results = [
                {**doc,  "co2e": self(**doc)["co2e"], "created": now, "savior_id": savior_id} 
                for doc in data
            ]
        return results 
