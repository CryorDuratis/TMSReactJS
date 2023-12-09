import React, { useState } from "react"

const TaskList = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Task 1", state: "open" },
    { id: 2, title: "Task 2", state: "to do" },
    { id: 3, title: "Task 3", state: "doing" },
    { id: 4, title: "Task 4", state: "done" },
    { id: 5, title: "Task 5", state: "closed" },
  ])

  const renderTasks = (state) => {
    return tasks
      .filter((task) => task.state === state)
      .map((task) => (
        <div key={task.id} className="task">
          {task.title}
        </div>
      ))
  }

  return (
    <div className="kanban-board">
      <div className="column">
        <h2>Open</h2>
        {renderTasks("open")}
      </div>
      <div className="column">
        <h2>To Do</h2>
        {renderTasks("to do")}
      </div>
      <div className="column">
        <h2>Doing</h2>
        {renderTasks("doing")}
      </div>
      <div className="column">
        <h2>Done</h2>
        {renderTasks("done")}
      </div>
      <div className="column">
        <h2>Closed</h2>
        {renderTasks("closed")}
      </div>
    </div>
  )
}

export default TaskList
