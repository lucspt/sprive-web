import { useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import { fetchData } from "../../../utils";
import { useEffect, useState } from "react";

export const loader = async ({ params }) => {
    return params.ids.split("&");
}

export const action = async ({ request }) => {
  let formData = await request.formData();
  formData = Object.fromEntries(formData);
  console.log(formData);
  return null;
}

export default function SuppliersMessenger() {
  const suppliers = useLoaderData();
  const [ suppliersData, setSuppliersData ] = useState([]);
  const fetcher = useFetcher();
  const nav = useNavigate();

  useEffect(() => {
    if (!suppliersData.length) {
      Promise.all(suppliers.map(id => (
        fetchData(`saviors/suppliers/${id}`)
      ))).then(res => setSuppliersData(Array.from(res, x => x.content)));
    }
  }, [suppliers]);

  
  const emails = Array.from(suppliersData, x => ` ${x.email}`);
  console.log(emails);
  return (
    <div style={{ height: "100%", padding: "40px" }}>
      <button onClick={() => nav(-1)} className="pink-hov">
        <span className="material-symbols-rounded">arrow_back</span>
      </button>
      <fetcher.Form 
        style={{height: "100%"}}
        action="."
        method="POST"
      >
        <div className="new-message">
          <div className="recipients input">
            {emails.length && 
              <span style={{color: "var(--soft-grey)", alignSelf: "center" }}>to</span>
            }
            {emails?.length > 0 && 
            emails.map(x => (
              <span className="to pill" key={x}>
              {x}
              <button 
                type="button"
                className="hidden"
                onClick={() => console.log("remove")}>
              <span className="material-symbols-rounded hidden white-hov">close</span>
              </button>
            </span>
            ))}
            <input
              type="hidden" 
              placeholder="recipients" 
              name="recipients" 
              value={emails}
              />
          </div>
          <input 
            readOnly
            value="Carbon Footprint Assesment" 
            name="subject"
            />
          <div className="message input">
            <input
              readOnly
              name="message"
              value="this will contain an invitation to free carbon monitoring for the recipients"
            />
            <button className="default-btn send">
              <span className="material-symbols-rounded">send</span>
            </button>
          </div>
        </div>
      </fetcher.Form>
    </div>
  )
}