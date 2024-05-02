import { useLoaderData } from "react-router-dom";
import { arrayRange } from "../../../utils/utils";
import TimelineDays from "./TimelineDays";
import "./TimelineRuler.css";
import { getMonthName } from "./utils";
import { TimelineLoaderResponse, TimelineRulerProps } from "./types";

let lastMonthEnd;
let lastDayRendered: number;

export default function TimelineRuler({ startMonthEnd, nextMonthEnd, twoMonthsEnd, }: TimelineRulerProps) {

  const { tasks } = useLoaderData() as TimelineLoaderResponse;
  const now = new Date();
  const currentMonth = now.getMonth();
  const today = now.getDate();
  return (
    <div className="ruler full-space">
      {
        [startMonthEnd, nextMonthEnd, twoMonthsEnd].map((date, index) => {
          const thisMonthEnd = date.getDate()
          lastMonthEnd = thisMonthEnd;
          const daysToRender = arrayRange(index === 0 ? 1 : 7 - (lastMonthEnd - lastDayRendered), thisMonthEnd, 7);
          lastDayRendered = daysToRender.at(-1) as number;
          const monthName = getMonthName(date);
          const month = date.getMonth();
          return (
            <TimelineDays 
              key={monthName}
              tasks={index === 0 ? tasks[month] : undefined}
              isCurrentMonth={month === currentMonth}
              currentMonthEnd={thisMonthEnd}
              showDueDate={index === 0 && thisMonthEnd - today < 8}
              days={daysToRender} 
              monthName={monthName}
              currentMonth={date}
              />
          )
        })
      }
    </div>
  )
}