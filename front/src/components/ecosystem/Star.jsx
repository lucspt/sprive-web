import { useCallback, useContext, useEffect, useRef } from "react"
import { Form } from "react-router-dom"
import { SaviorContext } from "../../contexts/SaviorContext"
import Login from "../Login";

const Star = function Star({ stars, resourceId, action=".", children=null }) {
  const { savior: { like_resource: saviorId } } = useContext(SaviorContext)
  const loginRef = useRef();
  
  const isLiked = useCallback(() => {
    return stars.includes(saviorId)
  }, [stars, saviorId])

  const formatNumStars = stars => new Intl.NumberFormat().format(stars)

  return (
    <>
    <Form
      replace={true}
      method={isLiked() ? "DELETE" : "POST"} 
      action={action}
      className="star"
    >
      <span>{formatNumStars(stars.length)}</span>
      { saviorId
        ? <button>
            <span 
              className={`material-symbols-rounded${isLiked() ? " filled" : ""}`} 
            >
              star
            </span>
          </button>
        : <button 
            type="button" 
            onClick={() => loginRef.current.classList.add("show")}
            className="needs-login" 
          >
          <span className="material-symbols-rounded" id="star">star</span>
        </button>
      }
    </Form>
    <div 
      className="login-cover" 
      ref={loginRef}
      onClick={e => loginRef.current.classList.remove("show")}
    >
      <div className="login-popup" onClick={e => e.stopPropagation()}>
        <Login 
          title="login to your account" 
          />
      </div>
    </div>
    </>  
  )
}

export default Star