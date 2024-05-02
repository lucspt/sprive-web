import { Header } from "../../header/Header";
import "./FileInput.css";
import { RequiredColumns } from "./RequiredColumns";
import { BaseInput } from "../../inputs/base/BaseInput";
import { useState } from "react";
import { FileInputProps } from "./types";
import { ACCEPTED_FILES } from "../../../constants";

/**
 * Renders a file input within a container, displaying the required fields / columns 
 * expected from the upload.
 * 
 * @param props 
 * @param props.requiredColumns - The columns / fields expected in the uploaded file
 * @param props.fileTypes - Passed to the `accept` property on the file input.
 * @param props.submitBtn - Whether to render a `button[type="submit"]` inside the container. 
 */
export function FileInput({ 
  requiredColumns=["activity", "value", "unit"], fileTypes, submitBtn, ...props
 }: FileInputProps) {

  const [ disabled, setDisabled ] = useState<boolean>(true);

  return (
    <div className="file-uploader">
      <div className="input-encasing">
        <Header text="Upload a file" fontSize="med" />
        <div className="main">
          <RequiredColumns columns={requiredColumns} />
          <div className="input-content">
            <div className="upload">
              <button className="default-btn upload-btn lg" type="button">
                Browse files
                <BaseInput 
                  name="file" 
                  type="file" 
                  title="" 
                  onChange={(e) => {e.target.value && setDisabled(false)}}
                  accept={fileTypes || ACCEPTED_FILES}
                  {...props}
                />
              </button>
            </div>
            {submitBtn &&
              <div className="submit">
              <button className="default-btn" type="submit" disabled={disabled}>Submit</button>
            </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}