import { defaultMockLogs } from "../msw/mock-data";
import { mockServerDateString } from "../utils";


const now = new Date();
const threeYearsAgo = new Date(new Date(new Date()).setFullYear(new Date().getFullYear() - 3));

const editLogsDate = (date: Date) => {
  return defaultMockLogs.map((x) => {
    return {
      ...x,
      source_file: {
        ...x.source_file,
        upload_date: mockServerDateString(date)
      }
    }
  });
};

export const mockLogsSinceYearAgo = editLogsDate(now);
export const mockLogsForPartnerOfThreeYears = [...mockLogsSinceYearAgo, ...editLogsDate(threeYearsAgo)];
