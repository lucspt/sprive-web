import { redirect, useFetcher } from "react-router-dom"
import { fetchData } from "../../../utils"



export const action = async ({ request }) => {
  let formData = await request.formData()
  formData = Object.fromEntries(formData)
  console.log(formData)
  // await fetchData("saviors/factors", "POST", formData)
  return redirect("../factors")
}


export default function FactorCreator() {

  const fetcher = useFetcher({ key: "factor-creator" })


  return (
    <div>create a factorrrrrrr right here right now

      <fetcher.Form action="." method="POST">
        <button>hi(:</button>
      </fetcher.Form>
    </div>
  )
}