import { useRouteError } from "react-router-dom";


export function Error() {
  const error = useRouteError() as { statusText?: string, message?: string };

  return (
    <div>
      error ! <span>{error.statusText || error.message }</span>
    </div>
  )
}