import "./RequiredColumns.css";
import { RequiredColumnsProps } from "./types";

const __DEFAULT_COLS = ["activity", "value", "unit"];

/**
 * See ./FileInput.tsx
 */
export function RequiredColumns({ columns }: RequiredColumnsProps) {

  columns = columns || __DEFAULT_COLS;
  return columns && (
    <div className="required-columns">
    <p>Make sure your file <br /> contains these columns</p>
    <div className="cols">
      {columns.map(x => (
        <span key={x}>{x}</span>
      ))}
    </div>
  </div>
  )
}