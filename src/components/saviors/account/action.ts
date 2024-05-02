import { fetchWithAuth } from "../../../utils/utils";

export const accountActions = async ({ request }: { request: Request } ) => {
  const { method } = request;
  if (method === "POST") {
    const formData = await request.formData();
    await fetchWithAuth(
      "saviors/company-tree", 
      { body: Object.fromEntries(formData.entries()), method: "POST"}
    );
    return true;
  };
  return null;
}