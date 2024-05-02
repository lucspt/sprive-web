import { SpriveResponse } from "../../../types";
import { fetchWithAuth } from "../../../utils/utils";
import { Product } from "./types";

//  <ProductCreator/>
export const productNamesFetcher = async () => {
  const res = await fetchWithAuth("/saviors/product-names") as SpriveResponse<string[]>;
  return res.content;
};

// <Products/>
export const productsLoader = async () => {
  const res = await fetchWithAuth("saviors/products") as SpriveResponse<Product[]>;
  return res.content;
};