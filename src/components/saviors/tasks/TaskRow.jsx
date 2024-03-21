const TaskRow = ({ name, category, assignee, action, onClick, fetcher }) => {

  return (
    <div className="task row">
      <span>{category}</span>
      <span>{name}</span>
      <span>{ assignee }</span>
      <button className="align-end" onClick={onClick}>
        <span className="align-end">{ action }</span>
      </button>
    </div>
  )
} 

export default TaskRow