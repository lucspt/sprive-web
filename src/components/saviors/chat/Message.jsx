import { useContext } from "react";
import { SaviorContext } from "../../../contexts/SaviorContext";
import "./Message.css";

export default function Message({ role, content }) {
  const { savior: { logo, username } } = useContext(SaviorContext);
  return (
    <div className="message">
      <div className="icon">
        <img 
          src="https://placeholder.co/40" 
          alt={role === "user" ? `${username}'s business logo` : "an icon of a ..."}
        />
      </div>
      <p className="content">
        {content}
      </p>
    </div>
  )
}