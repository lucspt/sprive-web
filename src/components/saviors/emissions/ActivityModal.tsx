import { useNavigate } from "react-router-dom"
import { Modal } from "../../modals/Modal";
import { Header } from "../../header/Header";
import "./ActivityModal.css";
import { ActivityModalProps } from "./types";

/**
 * A modal that renders when clicking on an activity of `<EmissionsByScopeTable>`.
 * 
 * @param visible - Whether or not the modal should render.
 * @param activity - The log's activity.
 * @param sourceFiles - All the files that uploaded logs with this activity and unit type.
 * @param value - The total value of all the logs of this activity.
 * @param region - The region of the activity's emission factor.
 * @param close - A function to close the modal.
 * @returns  - The activity info modal.
 */
export function ActivityModal({
  visible,
  activity,
  sourceFiles,
  value,
  region,
  close,
}: ActivityModalProps) {

  const nav = useNavigate();

  return (
    <Modal 
      visible={visible} 
      adjustCenterForSidebar
      close={close} 
      className="log-popup"
      showClose
      data-testid="log-popup"
      titleText={activity}
      titleSize="lg"
    >
      <div className="popup-content">
        <div className="summary">
          <div className="detail">
            <span className="detail-title">Value</span>
            <span>{ value }</span>
          </div>
          <div className="detail">
            <span className="detail-title">Location</span>
            <span>{ region }</span>
          </div>
        </div>
        <div className="source-files">
          <Header text="Source files" fontSize="med" />
          <div className="files">
            {
              sourceFiles?.map(({ name, upload_date, id }, i) => (
                <div className="file" key={i}>
                  <div className="info">
                    <span>{ name }</span>
                    <span className="file-date">
                      { 
                      new Date(upload_date).toLocaleTimeString(
                        [], {
                          year: 'numeric',
                          month: 'numeric', 
                          day: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit'
                      }
                      )
                        }
                    </span>
                  </div>
                  <button className="view-file" onClick={() => nav(`/saviors/files/${id}`)}>view</button>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </Modal>
  )
}