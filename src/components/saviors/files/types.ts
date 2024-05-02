import { ActivityInfo, Log, OnClickFn } from "../../../types"

export interface FileLogProps extends Omit<ActivityInfo, "unit_type"> {
  unitType: string,
  isProcessed: boolean,
  co2e?: number,
};

interface LogWithProcessedField extends Log {
  processed: boolean,
}

export interface FileViewerLoaderResponse {
  fileName: string,
  fileLogs: LogWithProcessedField[]
}


export interface UploadedFile {
  date: string,
  needs_processing: boolean,
  co2e: number 
  id: string,
}

export interface UploadedFileProps extends Omit<UploadedFile, "needs_processing"|"id"> {
  onClick: OnClickFn<HTMLDivElement>,
  needsProcessing: boolean,
}