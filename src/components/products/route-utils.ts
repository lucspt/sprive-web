import { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { RequestMethod, SpriveResponse } from "../../types";
import { fetchWithAuth } from "../../utils/utils";
import { Product } from "../saviors/products/types";


export const productCardLoader = async ({ params }: LoaderFunctionArgs) => { 
  let res: Response | SpriveResponse<Product> = await fetch(
    `${import.meta.env.VITE_API_URL}/products/${params.productId}`
  );
  res = await res.json();
  return (res as SpriveResponse<Product>).content;
};


export const productCardActions = async ({ params, request }: ActionFunctionArgs) => {
  const response = await fetchWithAuth(
    `products/${params.productId}/stars`, { method: request.method as RequestMethod }
  ) as SpriveResponse<boolean>;
  return response.content;
};