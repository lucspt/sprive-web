
export default function TableRow({ className, values }) {

  const last = values.at(-1);
  return (
    <div className={`row ${className}`}>
      {values.slice(values.length).map(x => (
        <span key={x}>{x}</span>
      ))}
      <span key={last} className="align-end">{last}</span>
    </div>
  )
}