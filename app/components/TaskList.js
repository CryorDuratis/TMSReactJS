// import node modules
import React, { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import CreateTask from "./CreateTask"
import Cookies from "js-cookie"
import Axios from "axios"

// import components

const TaskList = props => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // field values
  const { appid } = useParams()
  const [tasks, setTasks] = useState([
    { id: 1, title: "Task 1", state: "open" },
    { id: 2, title: "Task 2", state: "to do" },
    { id: 3, title: "Task 3", state: "doing" },
    { id: 4, title: "Task 4", state: "done" },
    { id: 5, title: "Task 5", state: "closed" }
  ])

  // rendering
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [ModalMode, setModalMode] = useState("")
  const [updateFlag, setUpdateFlag] = useState(false)
  const [isAuth, setIsAuth] = useState({
    PL: false,
    PM: false
  })

  // get all tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Make authorization request to the server
        const token = Cookies.get("token")
        // var response = await Axios.post("/task/getall", { token })

        // // if not logged in
        // if (response.data.unauth) {
        //   console.log("user is unauth")
        //   appDispatch({
        //     type: "logout",
        //     message: "Logged out"
        //   })
        //   navigate("/login")
        //   return
        // }
        // // set apps
        // setTasks(response.data.tasksData)
        // console.log("tasks obtained: ", response.data.tasksData)

        // check button authorization
        var response = await Axios.post("/checkgroup", { groupname: "Project Lead", token })
        console.log("checkgroup", response)

        if (!response.data.unauth) {
          setIsAuth(prev => ({ ...prev, PL: true }))
          console.log("create task set to true")
        } else if (isAuth.PL) {
          setIsAuth(prev => ({ ...prev, PL: false }))
        }

        // check button authorization
        response = await Axios.post("/checkgroup", { groupname: "Project Manager", token })
        console.log("checkgroup", response)

        if (!response.data.unauth) {
          setIsAuth(prev => ({ ...prev, PM: true }))
          console.log("edit plan set to true")
        } else if (isAuth.PM) {
          setIsAuth(prev => ({ ...prev, PM: false }))
        }
      } catch (error) {
        console.log("error: ", error)
      }
    }
    fetchTasks()
  }, [updateFlag])

  const renderTasks = state => {
    return tasks
      .filter(task => task.state === state)
      .map(task => (
        <div key={task.id} className="task">
          {task.title}
          {task.title}
          {task.title}
        </div>
      ))
  }

  // updates kanban board when new task is made or edited
  const updateTaskList = () => {
    console.log("update app list called")
    setUpdateFlag(prev => !prev)
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
      <div className="breadcrumb">
        <span onClick={e => navigate("/apps")}>Apps</span> / App Dashboard
      </div>
      {isModalOpen && (ModalMode === "create" ? <CreateTask onClose={handleCloseModal} update={updateTaskList} appid={appid} setIsAuth={setIsAuth} /> : <EditTask onClose={handleCloseModal} update={updateTaskList} appacro={ModalMode} setIsAuth={setIsAuth} />)}
      <div className="flex-row" style={{ justifyContent: "space-between" }}>
        <h2>{appid}</h2>
        <div className="flex-row">
          {isAuth.PM && (
            <button className="gobutton" onClick={e => navigate(pathname + "/plans")}>
              Edit Plans
            </button>
          )}
          {isAuth.PL && (
            <button className="gobutton" onClick={createModal}>
              Create Task
            </button>
          )}
        </div>
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
