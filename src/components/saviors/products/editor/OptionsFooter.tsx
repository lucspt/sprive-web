import "./OptionsFooter.css"
import { OptionsFooterProps } from "./types";
import { getMissingProductStages } from "./utils";



export default function OptionsFooter({ 
  stages, 
  isPublished, 
  showPublishPopup,
  showEditPopup,
  setWarn
}: OptionsFooterProps) {

  const openPopup = () => {
  
    const missingStages = getMissingProductStages(stages);
    if (!isPublished && missingStages.length > 0) {
      setWarn(missingStages);
    } else showPublishPopup();
  }

  return (
    <div className="options-footer">
      <button 
        className="default-btn"
        onClick={() => showEditPopup()}
      >
        edit
      </button>
      <button 
        className="default-btn" 
        onClick={openPopup}
      >
      {isPublished ? "unpublish" : "publish"}
      </button>
    </div>
  )
}