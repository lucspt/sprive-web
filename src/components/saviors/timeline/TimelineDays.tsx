import TimelineTasks from "./TimelineTasks";
import { getDateName } from "./utils";
import { TimelineDaysProps } from "./types";

export default function TimelineDays({ 
  monthName, 
  days, 
  tasks, 
  currentMonthEnd, 
  currentMonth,
  isCurrentMonth,
  showDueDate
 }: TimelineDaysProps) {

  const getPosOffset = (dayNum: number) => {
    if (dayNum === 1) return 0;
    return (dayNum / currentMonthEnd) * 100;
  };

  const now = new Date();
  const today = now.getDate();

  return (
    <div className="month">
      <p>{ monthName }</p>
      <div className="days">
        {
          days.map((day) => (
            <span key={day} className="day" style={{ left: `${getPosOffset(day)}%` }}>{ day }</span>
          ))
        }
        {tasks && isCurrentMonth && showDueDate && 
            <span className="due-warn">
              Tasks due {
              currentMonthEnd === today
                ? "today"
                : `on ${ currentMonth.toLocaleString("default", { weekday: "long" }) }, ${ getDateName(currentMonth) }` 
              }
            </span>
          }
          {isCurrentMonth && 
            <div className="today day" 
              style = {{ left: `${getPosOffset(today)}%` }}
            >
            <div className="marker" />
            <span id="today" className="day" style={{ transform: tasks && today === 1 ? "translateX(100%)" : "unset" }}>
              Today, { getDateName(now) }
            </span>
          </div>
          }
      </div>
      <div className="content">
        <div className="due-date" style={{ borderStyle: tasks ? "solid" : "dashed" }}/>
        {
          tasks 
            ? <TimelineTasks tasks={tasks} />
            : <div className="future inactive-opacity" />
        }
      </div>
    </div>
  )
}