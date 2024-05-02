import { HttpResponse, http } from "msw"
import { server } from "../../../msw/server"
import { defaultMockLogs } from "../../../msw/mock-data"


// export const MOCK_LOGS = [
//   {
//       "_id": "66051c273e617d50e6edf46d",
//       "activity": "TESTING-ACTIVITY",
//       "value": 10000,
//       "unit": "hours",
//       "source_file": {
//           "name": "TEST_SOURCE_FILE.csv",
//           "upload_date": "2024-03-25 08:57:00.522000",
//           "id": "66019eccd60d7fcb858e0c66",
//           "created_at": "2023-03-29 05:59:41.915000"
//       },
//       "scope": "2",
//       "category": "Utilities",
//       "unit_type": "energy",
//       "ghg_category": null,
//       "co2e": 5,
//       "savior_id": "65ec0c94fec14e62f2b1eabd"
//   },
// ]

// export const setupLogsHandler = () => {
//   server.use(
//     http.get("http://localhost:8000/saviors/logs", () => {
//       return HttpResponse.json({ content: defaultMockLogs}, { status: 200 });
//     })
//   )
// }