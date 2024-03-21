import "./RequiredColumns.css";

export default function RequiredColumns({ columns }) {

  return (
    <div className="required-columns">
    <p>Make sure your file contains these columns</p>
    <div className="cols">
      {columns.map(x => (
        <span key={x}>{x}</span>
      ))}
    </div>
  </div>
  )
}