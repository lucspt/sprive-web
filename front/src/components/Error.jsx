import { useRouteError } from "react-router-dom";


export default function Error() {
  const error = useRouteError()

  return (
    <div>
      error ! 

      <span>{error.statusText || error.message }</span>
    </div>
  )
}