import { useLoaderData } from "react-router-dom";
import "./ProcessEditor.css";
import { useState } from "react";
import { fetchData } from "../../../../utils";
import ProcessEditorTitle from "./ProcessEditorTitle";
import CurrentProcessRow from "./CurrentProcessRow";
import EmissionFactors from "../../factors/EmissionFactors";

export async function editProcess({ request, params }) {

  let { method, formData } = request;
  formData = await request.formData();
  formData = Object.fromEntries(formData.entries());
  const { co2e, _id, stageName, ...processUpdate } = formData; 
  // we take away _id to avoid update errors and well why would we send co2e
  processUpdate.activity_value = Number(processUpdate.activity_value);
  const endpoint = method === "POST"
    ? `products/${params.productId}/${stageName}/processes`
    : `products/processes/${_id}`
  await fetchData(endpoint, method, processUpdate);
  return null;
}

export default function ProcessEditor({ editingProcess, onFinish, fetcher }) {
  const [ chosen, setChosen ] = useState({});
  const { stageName } = editingProcess;
  const { name: productName } = useLoaderData();
  const [ wasEdited, setWasEdited ] = useState(false);
  let { method, ...processCurrently } = editingProcess;
  const [ process, setProcess ] = useState({...processCurrently, ...chosen});

  const updateProcess = update => {
    setProcess(prev => ({...prev, ...update, co2e: "N/A"}));
    setWasEdited(true);
  };

  const updateFromRow = (field, update) => {
    setWasEdited(true);
    setProcess(prev => ({...prev, [field]: update}));
  };

  const onSave = () => {
    fetcher.submit(process, {method, action: "."});
    onFinish();
  };

  const saveBtnDisabled = (
    !["activity", "process", "activity_unit", "activity_value", ].every(x => process[x])
  )

  return (
    <div className="full-space process-editor product-editor">
      <section>
      <div className="edit-process">
        <div className="title">
          <ProcessEditorTitle 
            processName={process.process}
            stageName={stageName}
            productName={productName}
          />
        </div>
      </div>
      </section>
      <section className="factors-section">
      <fetcher.Form action="." method={method}>
        <CurrentProcessRow process={process} updateProcess={updateFromRow}/>
      </fetcher.Form>
      <EmissionFactors returnFactor={updateProcess}/>
      </section>
      {wasEdited && 
      <section className="save-footer">
        <div>
          <button disabled={saveBtnDisabled} className="default-btn" onClick={onSave}>save</button>
        </div>
      </section>
      }
    </div>
  )
}