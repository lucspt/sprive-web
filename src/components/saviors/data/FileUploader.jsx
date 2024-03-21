import Header from "../../Header";
import "./FileUploader.css";
import RequiredColumns from "./RequiredColumns";


export default function FileUploader({ 
  title="Upload your file",
  columns=["activity", "value", "unit"]
 }) {

  return (
    <div className="file-uploader">
      <Header text={title} />
      <div className="spacing">
        <div className="content">
          <RequiredColumns columns={columns} />
          <div className="upload-container">
            <input type="file" name="file" title=""/>
            <span className="material-symbols-rounded" style={{fontSize: 40}}>upload_2</span>
            <button className="upload-button">Upload</button>
          </div>
        </div>
      </div>
    </div>
  )
}