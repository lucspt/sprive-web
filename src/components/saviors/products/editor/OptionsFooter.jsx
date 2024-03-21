import { _REQUIRED_STAGES } from "../../../products/ProductCard";
import "./OptionsFooter.css"
import { useNavigate } from "react-router-dom";


export const getMissingProductStages = (productStages) => {
  const uniqueStages = Array.from(productStages, stage => stage.stage);
  const missingRequiredStages = _REQUIRED_STAGES.filter(
    x => !uniqueStages.includes(x)
  );
  const stagesWithoutCO2e = productStages.filter(x => x.processes?.length < 1);
  return [...missingRequiredStages, ...stagesWithoutCO2e];
}

export default function OptionsFooter({ 
  stages, 
  isPublished, 
  showPublishPopup,
  showEditPopup,
  setWarn
}) {

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
        onClick={showEditPopup}
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