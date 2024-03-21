import { useContext } from "react";
import { SaviorContext } from "../contexts/SaviorContext";
import { useNavigate } from "react-router-dom";


export default function Settings() {
  const { savior, setSavior } = useContext(SaviorContext);
  const nav = useNavigate();

  return (
    <div>

      <button onClick={() => {setSavior({}); nav("/")}}>logout</button>
    </div>
  )
}