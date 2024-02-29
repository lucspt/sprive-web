import { useNavigate } from "react-router-dom"


export default function Branch({name, rel}) {
  const nav = useNavigate()

  return (
    <div className="branch">
      <button onClick={() => nav(`${rel}/${name}`)}>
        {name}
      </button>
    </div>
  )
}