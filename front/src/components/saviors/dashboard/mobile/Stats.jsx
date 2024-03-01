
import { memo, useContext, useEffect, useState } from "react"
import { formatCO2e, isObjectEmpty, windowSize } from "../../../../utils"
import { SaviorContext } from "../../../../contexts/SaviorContext"
import { useLocation } from "react-router-dom"
import "./Stats.css"


const CO2eDigit = ({ co2e }) => {
  const [ digit, metric ] = formatCO2e(co2e);

  return (
    <>
      <span className="stats-digit">{digit} </span>
      <span className="stats-metric">{metric}</span>
    </>
  )
}
export const StatsPanel = memo(function StatsPanel({ pledges, emissions, fetchStats }) {
  const [ stats, setStats ] = useState({});
  const { getData, savior } = useContext(SaviorContext);
  const { search } = useLocation();
  const [ hide, setHide ] = useState(false);
  useEffect(() => {
    if (search.includes("overview") && !hide) {
      setHide(true);
    } else if (hide) {
      setHide(false);
    }
  }, [search]) 

  useEffect(() => {
    if (hide) return;
    if (isObjectEmpty(savior)) {
      setStats({});
    } else if (fetchStats && isObjectEmpty(stats)) {
        async function getStats() {
          const response = await getData("stats");
          setStats(response.content);
        }
      getStats();
    } else if (pledges && emissions) {
      setStats({
        "pledges": pledges,
        "emissions": emissions
      });
    }
  }, [fetchStats, savior, stats])

  const { pledges: _pledges, emissions: _emissions } = stats
  return !hide && _pledges && _emissions && (
    <div 
      className={`plot stats ${windowSize}${fetchStats ? " overview" : ""}${hide ? " hide" : ""}`}
      >
      <div className="long">
        <span>{_emissions.time_period} emissions:</span>
      <div className="align">
        <CO2eDigit co2e={_emissions.total_co2e} />
      </div>
      </div>
      <div className="halves">
        <div className="half align">
          <span>pledges made:</span>
          <span className="stats-digit">{_pledges.count}</span>
          </div>
        <div className="half impact align">
          <span>CO2e saved:</span>
        <div>
          <CO2eDigit co2e={_pledges.total_co2e} />
        </div>
      </div>
    </div>
    {windowSize === "small" && <div className="stats-bg" />}
  </div>
    )
})