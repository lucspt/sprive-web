import { memo, useRef } from "react";

const Sidebar = memo(function Sidebar({ }) {
  const sidebarDragger = useRef()

  const drag = e => {
    // if (!sidebarDragger.current) return;
    console.log(e) 
  }

  const onMouseDown = e => {
    console.log(e)
    window.addEventListener("mousemove",  drag)
  }

  const onMouseUp = e => {
    console.log("MOUSE UPPPPPPP")
    window.removeEventListener("mousemove", drag)
  }
  return (
    <div className="sidebar-grid">
      <div className="sidebar">
        <button 
          id="sidebar-drag"
          ref={sidebarDragger}
          tabIndex={0}
          onMouseDown={e => onMouseDown(e)}
          onMouseUp={e => onMouseUp(e)}
        >

        </button>
      </div>
    </div>
  )
})

export default Sidebar