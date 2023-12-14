// import node modules
import React, { useState } from "react"
import { useParams } from "react-router-dom"

// import components

const TaskList = (props) => {
  const { appid } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [ModalMode, setModalMode] = useState("")
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

  // updates kanban board when new task is made or edited
  const updateTaskList = () => {
    console.log("update app list called")
    setUpdateFlag((prev) => !prev)
  }
  // control create task and edit task popup modal
  const createModal = () => {
    setModalMode("create")
    setIsModalOpen(true)
  }
  const editModal = (e, App_Acronym) => {
    e.stopPropagation()
    setModalMode(App_Acronym)
    setIsModalOpen(true)
  }
  const handleCloseModal = () => {
    // close Modal
    setIsModalOpen(false)
  }

  return (
    <div className="content-container bgclr-light1">
      {isModalOpen && (ModalMode === "create" ? <CreateTask onClose={handleCloseModal} update={updateTaskList} /> : <EditTask onClose={handleCloseModal} update={updateTaskList} appacro={ModalMode} />)}
      <div className="flex-row" style={{ justifyContent: "space-between" }}>
        <h2>{appid}</h2>
        <button className="gobutton">Create Task</button>
      </div>
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
    </div>
  )
}

export default TaskList
