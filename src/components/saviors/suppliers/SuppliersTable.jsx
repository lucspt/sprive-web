import { Header } from "../../header/Header";
import { DataTable } from "../../table/DataTable";
import SupplierRow from "./SupplierRow";

export default function SuppliersTable({ 
  showModal, 
  selectSupplier, 
  deselectSupplier, 
  selectedSuppliers
 }) {

  return (
    <DataTable
      columns={[
        "", "Supplier", "Emissions", "Rank", "Priority", "Participation"
      ]}
      TitleComponent={
        <Header fontSize="lg" text="Suppliers" className="table-title">
          <div className="actions">
            {selectedSuppliers.length > 0 && 
              <button className="default-btn" onClick={showModal}>Contact</button>
            }
            <button className="default-btn" onClick={showModal}>Add new</button>
          </div>
        </Header>
      }
    >
      <SupplierRow 
        name="123" 
        emissions={25} 
        rank={3} 
        priority="high" 
        selectSupplier={selectSupplier}
        deselectSupplier={deselectSupplier}
        isSelected={selectedSuppliers.some(x => x._id === 1)}
        participation="reductions, initiatives" 
        toggleCheck={() => null}
      />
  </DataTable>
  )
}