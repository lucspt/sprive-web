import { Link, Outlet } from 'react-router-dom'
import './Root.css'
import "./styles/base.css"
import "./styles/saviors.css"
import Crown from './components/crown/Crown'
import { isObjectEmpty, windowSize } from './utils'
import { StatsPanel } from './components/saviors/mobile/Stats'
import { memo } from 'react'

const Root =  memo(function Root() {

  const isSmall = windowSize === "small"
  const notSavior = isObjectEmpty(JSON.parse(localStorage.getItem("savior")))
  return (
    <div id="root-grid">
      <Crown/>
      <main className={windowSize}>
        {isSmall && notSavior && 
        <div className="login-mob">
          <button className="white-btn">
            <Link tabIndex={1} to="/login">login</Link>
          </button>
        </div> 
        }
      <Outlet />
      { isSmall && <StatsPanel fetchStats={true}/> }
      </main>
    </div>
  )
})

export default Root
