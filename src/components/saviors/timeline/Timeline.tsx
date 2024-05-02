import { Header } from "../../header/Header";
import TimelineRuler from "./TimelineRuler";
import { useLoaderData } from "react-router-dom";
import { TimelineLoaderResponse } from "./types";



const getMonthEnd = (date: Date, monthNum: number) => new Date(date.setMonth(monthNum + 1, 0));
export function Timeline() {
  const { startMonthNum } = useLoaderData() as TimelineLoaderResponse;
  const now = new Date();
  const startDate = new Date(now.setMonth(startMonthNum + 1, 0))
  const startMonthEnd = getMonthEnd(startDate, startMonthNum);
  const nextMonthEnd = getMonthEnd(startDate, startMonthNum + 1);
  const twoMonthsEnd = getMonthEnd(startDate, startMonthNum + 2);

  return (
    <div className="timeline">
      <Header text="Timeline" className="page"/>
      <section className="full-space">
        <TimelineRuler 
          startMonthEnd={startMonthEnd} 
          nextMonthEnd={nextMonthEnd} 
          twoMonthsEnd={twoMonthsEnd}
        />
      </section>
    </div>
  )
}