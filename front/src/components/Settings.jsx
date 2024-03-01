import { useContext } from "react";
import { SaviorContext } from "../contexts/SaviorContext";
import { useNavigate } from "react-router-dom";


export default function Settings() {
  const { savior, logout } = useContext(SaviorContext);
  const nav = useNavigate();

  return (
    <div>

      <button onClick={() => {logout(); nav("/")}}>logout</button>
    </div>
  )
}