import { useContext, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { SaviorContext } from "../contexts/SaviorContext"

export default function Login({ className="", title=null, navOnSuccess=true }) {
  const nav = useNavigate();
  const { state } = useLocation();

  const [ isPartner, setIsPartner ] = useState(false);
  const { login } = useContext(SaviorContext);
  const [ error, setError ] = useState("");

  return (
    <div className={`login${error ? " error" : ""} ${className}`}>
      { title && <span>{title}</span>}
      <button className="switch-input" 
        type="button"
        onClick={e => {
          setIsPartner(prev => !prev)
          e.target.classList.toggle("active")
        }}
        >
          <div className="bg" >
            <span>{isPartner ? "partner" : "user"}</span>
            </div>
          <div className="circle" />
      </button>
      <form 
        className="form" 
        onSubmit={
          e => login(
            e, 
            () => 
            navOnSuccess 
              ? nav(
                isPartner 
                  ? "/saviors/overview" 
                  : state 
                  ? state 
                  : -1, {replace: true}
                ) 
                : null, 
              setError)
          }
      >
        <div className="form">
        <input type="hidden" name="savior_type" value={isPartner ? "partners" : "users"} />
        <label htmlFor="username">
          username
          <input 
            className="rounded-input"
            id="username"
            type="text"
            name="username"
            autoComplete="off"
          />
        </label>
        <label htmlFor="password">
          password
          <input 
            id="password"
            type="password"
            name="password"
            className="rounded-input"
          />
        </label>
        </div>
        {error && <span style={{ color: "var(--eco-danger)"}}>{ error }</span>}
        <div className="form" style={{ gap: "unset" }}>
          <button type="submit" className="submit default-btn">login</button>
          <div className="extras">
          <Link to="/signup" state={state}>create an account</Link>
        </div>
        </div>
      </form>
    </div>
  )
}