const infoToDisplay = [
  { key: "process", label: "Process name", readOnly: false},
  { key: "activity_value", label: "Value", readOnly: false},
  { key: "activity_unit", label: "Unit", readOnly: false},
  { key: "activity", label: "Activity", readOnly: true},
  { key: "co2e", label: "CO2e", readOnly: true},
]

export default function CurrentProcessRow({ process, updateProcess }) {

  return (
    <div className="currently">
    <p className="title">Currently:</p>
      <div className="currently-row">
        {infoToDisplay.map(({ key, label, readOnly, name }) => (
          <div className="current-info" key={key}>
            <label>{label}</label>
            {readOnly ? (
              <span>{process[key] || "N/A"}</span>
            ) : (
              <input 
              type="text"
              autoComplete="off"
              spellCheck="false"
              className={`readonly-${readOnly}`}
              readOnly={readOnly}
              onChange={(e) => updateProcess(key, e.target.value)}
              value={process[key]}
              placeholder={"N/A"}
              name={key}
              />
            )
          }
          </div>
        ))}
    </div>
  </div>
  )
}