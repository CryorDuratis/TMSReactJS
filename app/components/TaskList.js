// import node modules
import React, { useContext, useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import CreateTask from "./CreateTask"
import Cookies from "js-cookie"
import Axios from "axios"
import EditTask from "./EditTask"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

// import components

const TaskList = props => {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // field values
  const { appid } = useParams()
  const [tasks, setTasks] = useState([])

  // rendering
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [ModalMode, setModalMode] = useState("")
  const [taskid, setTaskid] = useState("")
  const [updateFlag, setUpdateFlag] = useState(false)
  const [isAuth, setIsAuth] = useState({
    Task: false,
    Plan: false
  })

  // get all tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Make authorization request to the server
        const token = Cookies.get("token")
        var response = await Axios.post("/task/getall", { appid, token })

        // if not logged in
        if (response.data.unauth) {
          console.log("user is unauth")
          appDispatch({
            type: "logout",
            message: "Logged out"
          })
          navigate("/login")
          return
        }
        // set tasks
        setTasks(response.data.tasksData)
        console.log("tasks obtained: ", response.data.tasksData)

        // fetch app permissions
        var response = await Axios.post("/app", { App_Acronym: appid, token })

        // check if app exists
        if (!response.data.appData) {
          appDispatch({
            type: "btoast",
            message: "App does not exist, redirecting back to Apps"
          })
          navigate("/apps")
          return
        }
        const createpermit = response.data.appData.App_permit_Create

        // check create task button authorization
        response = await Axios.post("/checkgroup", { groupname: createpermit, token })
        console.log("create task permit: ", !response.data.unauth)

        if (!response.data.unauth) {
          setIsAuth(prev => ({ ...prev, Task: true }))
        } else if (isAuth.Task) {
          setIsAuth(prev => ({ ...prev, Task: false }))
        }

        // check edit plan button authorization
        response = await Axios.post("/checkgroup", { groupname: "Project Manager", token })
        console.log("edit plan permit: ", !response.data.unauth)

        if (!response.data.unauth) {
          setIsAuth(prev => ({ ...prev, Plan: true }))
        } else if (isAuth.Plan) {
          setIsAuth(prev => ({ ...prev, Plan: false }))
        }
      } catch (error) {
        console.log("error: ", error)
      }
    }
    fetchTasks()
  }, [updateFlag])

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
  const editModal = (e, taskid) => {
    e.stopPropagation()
    setModalMode("edit")
    setTaskid(taskid)
    setIsModalOpen(true)
  }
  const handleCloseModal = () => {
    // close Modal
    setIsModalOpen(false)
  }

  const renderTasks = state => {
    return tasks
      .filter(task => task.Task_state === state)
      .map(task => (
        <div key={task.Task_id} className="task" onClick={e => editModal(e, task.Task_id)}>
          {task.Task_name}
          <span>
            <b>{task.Task_id} </b> <div className="task-owner">{task.Task_owner}</div>
          </span>
        </div>
      ))
  }

  return (
    <div className="content-container bgclr-light1">
      <div className="breadcrumb">
        <span onClick={e => navigate("/apps")}>Apps</span> / App Dashboard
      </div>
      {isModalOpen && (ModalMode === "create" ? <CreateTask onClose={handleCloseModal} update={updateTaskList} appid={appid} setIsAuth={setIsAuth} /> : <EditTask onClose={handleCloseModal} update={updateTaskList} appid={appid} taskid={taskid} setIsAuth={setIsAuth} />)}
      <div className="flex-row" style={{ justifyContent: "space-between" }}>
        <h2>{appid}</h2>
        <div className="flex-row">
          {isAuth.Plan && (
            <button className="gobutton" onClick={e => navigate(pathname + "/plans")}>
              Edit Plans
            </button>
          )}
          {isAuth.Task && (
            <button className="gobutton" onClick={createModal}>
              Create Task
            </button>
          )}
        </div>
      </div>
      <div className="kanban-board">
        <div className="column">
          <h2>Open</h2>
          {renderTasks("Open")}
        </div>
        <div className="column">
          <h2>To Do</h2>
          {renderTasks("To do list")}
        </div>
        <div className="column">
          <h2>Doing</h2>
          {renderTasks("Doing")}
        </div>
        <div className="column">
          <h2>Done</h2>
          {renderTasks("Done")}
        </div>
        <div className="column">
          <h2>Closed</h2>
          {renderTasks("Closed")}
        </div>
      </div>
    </div>
  )
}

export default TaskList
