import { PossiblyEmptyLogs, SpriveResponse } from "../../../types";
import { fetchWithAuth } from "../../../utils/utils";

// Loads logs for /saviors/overview
export const overviewLoader = async (): Promise<PossiblyEmptyLogs> => {
  const res = await fetchWithAuth("saviors/logs") as SpriveResponse<PossiblyEmptyLogs>;
  return res.content;
};