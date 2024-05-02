import { PossiblyEmptyLogs, SpriveResponse } from "../../../types";
import { fetchWithAuth } from "../../../utils/utils"

export const emissionsLoader = async (): Promise<PossiblyEmptyLogs> => {
  const res = await fetchWithAuth("saviors/logs") as SpriveResponse;
  return res.content;
};