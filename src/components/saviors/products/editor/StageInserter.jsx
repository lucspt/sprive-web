import ValidatedInput from "../../../ValidatedInput";

const applyUpdate = (addStage, e, validation) => {
  e.preventDefault();
  const stageName = e.target.elements["stage"];
  if (validation) {
    if (validation.some(x => x.stage === stageName.value)) {
      stageName.classList.add("unique-warn");
      return;
    }
  }
  let formData = new FormData(e.target);
  formData = Object.fromEntries(formData);
  formData.processes = [];
  addStage(formData);
}

export default function StageInserter({ addStage, close, validation }) {

  return (
    <form onSubmit={e => applyUpdate(addStage, e, validation)}>
      <div className={`stage item`}>
      <div className="stage-info">
        <div className={`heading add`}>
          <ValidatedInput
            type="text"
            name="stage"
            placeholder="stage name" 
            onChange={e => e.target.classList.remove("unique-warn")}>
          <span className="warn">stage names should be unique</span>
          </ValidatedInput>
          <button 
            type="button"
            onClick={close}
          >
            <span className="material-symbols-rounded white-hov">close</span>
          </button>
        </div>
      </div>
      </div>
      <input type="submit" style={{display: "none"}} />
    </form>
  )
}
