import { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { RequestMethod, SpriveResponse } from "../../../../types";
import { fetchWithAuth } from "../../../../utils/utils";
import { Product } from "../types";

export const loadProductForPartner = async ({ params }: LoaderFunctionArgs) => {
  const productId = params.productId;
  const res = await fetchWithAuth(`saviors/products/${productId}`) as SpriveResponse<Product>;
  return res.content;
};

export const editProcess  = async ({ request, params }: ActionFunctionArgs) => {
  
    let { method } = request;
    const _formData = await request.formData();
    const formData = Object.fromEntries(_formData.entries());
    const { 
      co2e, 
      _id, 
      stageName, 
      stageIndex, 
      productId, 
      activity_id,
      ...processUpdate 
    } = formData; 
    const endpoint = method === "POST"
      ? `products/${params.productId}/${stageName}/processes`
      : `products/processes/${_id}`
    
    await fetchWithAuth(
      endpoint, { 
        body: {
          ...processUpdate,
          activity_value: Number(processUpdate.activity_value)
        },
        method: method as RequestMethod 
      },

    );
    return null;

}