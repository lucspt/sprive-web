import { LoaderFunctionArgs } from "react-router-dom";
import { SpriveResponse } from "../../../types";
import { fetchWithAuth } from "../../../utils/utils";

export const fileLogsLoader = async ({ params }: LoaderFunctionArgs ) => {
  const { fileId } = params;
  const res = await fetchWithAuth(`saviors/files/${fileId}`) as SpriveResponse;
  const { content } = res;
  return {
    fileLogs: content, 
    fileName: content[0]?.source_file?.name 
  };
};