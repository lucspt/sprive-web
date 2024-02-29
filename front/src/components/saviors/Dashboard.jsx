import { useEffect, memo, useContext, useMemo, useCallback, useState } from "react";
import { useLoaderData } from "react-router-dom";
import {  windowSize } from "../../utils"
import { SaviorContext } from "../../contexts/SaviorContext";
import Pledges from "./pledges/Pledges";
import Overview from "./dashboard/Overview";
import MobileOverview from "./dashboard/mobile/Overview";
import DashboardRouter from "./dashboard/DashboardRouter"
import Products from "./dashboard/products/Products";
import Suppliers from "./dashboard/suppliers/Suppliers";
import Emissions from "./dashboard/Emissions";

export const loader = async ({ request }) => {
  const url = new URL(request.url)
  const section = url.searchParams.get("section")
  return section
}


const Dashboard = memo(function Dashboard() {
  
  const { getData } = useContext(SaviorContext)
  const [ data, setData ] = useState({})
  const currentSection = useLoaderData()
  
  const getDashboard = useCallback(async dashboard => {
    const response = await getData(dashboard)
    setData({...response, "currentSection": dashboard})
  }, [data.data_type])
  
  useEffect(() => {
    if (currentSection !== data.data_type) {
      if (currentSection === "emissions") {
        setData({"currentSection": "emissions"});
        return 
      }
      getDashboard(currentSection)
    }
  }, [currentSection])

  const componentMappings = useMemo(() => {
    const content = data.content
    const mappings = windowSize !== "small" ? {
      "overview":  <Overview content={content}/>,
      "emissions": <Emissions content={content}/>,
      "suppliers": <Suppliers suppliers={content}/>,
      "pledges": <Pledges pledges={content} />,
      "products": <Products products={content} />,
    } : {
      "overview": <MobileOverview content={content} />
    }
    return mappings
  }, [data, currentSection])


  return (
      <div 
        className={`dashboard-container ${currentSection}`}
      >
        <DashboardRouter currentSection={currentSection}/>
        <div className={`dashboard ${windowSize} ${currentSection}`}>
          {data?.currentSection === currentSection && componentMappings[currentSection]}
        </div>
      </div>
  )
});

export default Dashboard