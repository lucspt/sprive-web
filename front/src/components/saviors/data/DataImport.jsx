import { useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { allowHeaders, getCookie } from "../../../utils"
import "./DataImport.css"

const ACCEPTED_FILES = [
  ".csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
].join(", ");

export default function DataImporter() {
  const nav = useNavigate();
  const fileInput = useRef();

  const uploadData = useCallback(async (e) => {
    const formData = new FormData();
    formData.append("file[]", e.target.files[0]);
    console.log(e.target.files[0]);
    let response = await fetch(
      "http://localhost:8000/saviors/files", {
        method: "POST",
        headers: {
          // "Content-Type": "application/json",
          "X-CSRF-TOKEN": getCookie("csrf_access_token"),
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Headers": allowHeaders
        },
        body: formData,
        credentials: "include",
      }
    );
    response = await response.json();
    if (response.ok) {
      nav(`../tables/${response.content.filename}`);
    }

  }, []);
  
  return (
    <div className="upload">
      <div className="content" style={{height: "100%"}}>
        <div className="top">
          <button 
            className="white-hov"
            onClick={() => nav("../requirements")}
          >
            <span className="material-symbols-rounded">rule</span>
            preview file requirements
          </button>
        </div>
        <div className="uploader">
          <div className="container" >
            <input 
            type="file"
            tabIndex={1}
            className="import"
            accept={ACCEPTED_FILES}
            onChange={e => uploadData(e)}
            ref={fileInput}
            id="import-file"
            aria-label="upload a file containing emissions data"
            title="Import file"
            />
            <div id="dear-earth"> 
              <div className="clip-circle">
                <div className="cube-wrapper">
                  <div className="cube-2">
                    <div className="cube">
                      <div className="face" id="f1"></div>
                      <div className="face" id="f2"></div>
                      <div className="face" id="f3"></div>
                      <div className="face" id="f4"></div>
                      <div className="face" id="f5"></div>
                      <div className="face" id="f6"></div>
                      <div className="face" id="f7"></div>
                      <div className="face" id="f8"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lighting circle"></div>
            </div>
            <button className="default-btn import ltr" 
              onClick={() => fileInput.current?.click()}
              tabIndex={0}
            >
            upload file
          </button>
        </div>
      </div>
    </div>
  </div>
  )
}