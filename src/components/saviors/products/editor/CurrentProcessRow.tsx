import { CurrentProcessRowProps } from "./types"

const infoToDisplay = [
  { key: "process", label: "Process name", readOnly: false, type: "text"},
  { key: "activity_value", label: "Value", readOnly: false, type: "number"},
  { key: "activity_unit", label: "Unit", readOnly: false, type: "text"},
  { key: "activity", label: "Activity", readOnly: true},
  { key: "co2e", label: "CO2e", readOnly: true},
]

export function CurrentProcessRow({ process, updateProcess }: CurrentProcessRowProps) {

  return (
    <div className="currently">
    <p className="title">Currently:</p>
      <div className="currently-row">
        {infoToDisplay.map(({ key, label, readOnly, type }) => (
          <div className="current-info" key={key}>
            <label htmlFor={key}>{label}</label>
            {readOnly ? (
              <span>{process[(key as keyof typeof process)] || "N/A"}</span>
            ) : (
              <input 
                type={type}
                autoComplete="off"
                spellCheck="false"
                className={`readonly-${readOnly}`}
                readOnly={readOnly}
                onChange={(e) => updateProcess(key, e.target.value)}
                value={process[(key as keyof typeof process)]}
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