import { To, useLocation, useNavigate } from "react-router-dom"
import { fetchWithAuth } from "../../../utils/utils"
import { FileInput } from "../../inputs/file/FileInput";
import { useEffect } from "react";
import { OnChangeFn, SpriveResponse } from "../../../types";
import { ACCEPTED_FILES } from "../../../constants";

export function FileImporter() {
  const { state } = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    const { emissionsScope, category } = (state || {});
    if (!state || !emissionsScope || !category) {
      nav(-1 as To, { replace: true });
    }
  }, [state]);

  const { emissionsScope, category, unitType, ghgCategory, taskId } = (state || {});
  const uploadData: OnChangeFn =  async (e) => {
    const formData = new FormData();
    if (!e.target?.files) throw Error("File upload did not work");
    formData.append("file[]", e.target.files[0]);
    formData.append("scope", emissionsScope);
    formData.append("category", category);
    formData.append("unit_type", unitType);
    if (taskId) {
      formData.append("task_id", taskId);
    };
    if (ghgCategory) formData.append("ghg_category", ghgCategory);
    let response = await fetchWithAuth(
      "saviors/files", 
      { 
        body: formData, 
        stringifyBody: false, 
        isFileUpload: true,
        method: "POST",
      }
    ) as SpriveResponse;
    nav(`../files/${response.content}`, {replace: true});
  };

  
  return (
    <div className="upload">
      <form 
        className="content full-space" 
        // onSubmit={uploadData} 
        encType="multipart/form-data"
        action=""
        method="POST"
      >
        <FileInput 
          requiredColumns={["activity", "value", "unit"]} 
          fileTypes={ACCEPTED_FILES}
          onChange={uploadData}
          tabIndex={1}
          id="import-file"
          aria-label="upload a file containing emissions data"
          title="Import file"
          submitBtn={false}
        />
      </form>
  </div>
  )
}