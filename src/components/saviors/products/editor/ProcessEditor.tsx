import { useLoaderData } from "react-router-dom";
import "./ProcessEditor.css";
import { useState } from "react";
import { ProcessEditorTitle } from "./ProcessEditorTitle";
import { CurrentProcessRow } from "./CurrentProcessRow";
import { Product, ProductProcess } from "../types";
import { ProcessEditorProps } from "./types";
// import EmissionFactors from "../../factors/EmissionFactors";

export default function ProcessEditor({ editingProcess, onFinish, fetcher }: ProcessEditorProps) {
  const [ chosen, _ ] = useState({});
  const { stageName } = editingProcess;
  const { name: productName } = useLoaderData() as Product;
  const [ wasEdited, setWasEdited ] = useState(false);
  let { method, ...processCurrently } = editingProcess;
  const [ process, setProcess ] = useState<Partial<ProductProcess>>({...processCurrently, ...chosen});

  // const updateProcess = (update: Partial<ProductProcess>) => {
  //   setProcess(prev => ({...prev, ...update, co2e: "N/A"}));
  //   setWasEdited(true);
  // };

  const updateFromRow = (field: string, update: any) => {
    setWasEdited(true);
    setProcess((prev) => ({...prev, [field]: update}));
  };

  const onSave = () => {
    fetcher.submit(process, {method, action: "."});
    onFinish();
  };

  const saveBtnDisabled = (
    !(["activity", "process", "activity_unit", "activity_value", ] as Array<keyof typeof process>)
    .every((x) => process[x])
  )
  return (
    <div className="full-space process-editor product-editor" data-testid="process-editor">
      <section>
      <div className="edit-process">
        <div className="title">
          <ProcessEditorTitle 
            processName={process.process as string}
            stageName={stageName}
            productName={productName}
          />
        </div>
      </div>
      </section>
      <section className="factors-section">
      <fetcher.Form action="." method={method}>
        <CurrentProcessRow process={process as ProductProcess} updateProcess={updateFromRow}/>
      </fetcher.Form>
      {/* <EmissionFactors returnFactor={updateProcess}/> */}
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