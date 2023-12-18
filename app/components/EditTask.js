import React, { useContext, useEffect, useState } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import Cookies from "js-cookie"
import Axios from "axios"
import { useNavigate } from "react-router-dom"
import Popup from "./Popup"

function EditTask(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  // state of fields
  const [taskData, setTaskData] = useState({
    Task_name: "Loading...",
    Task_description: "Loading...",
    Task_id: "Loading...",
    Task_app_Acronym: "Loading...",
    Task_state: "Loading...",
    Task_plan: "Loading...",
    Task_creator: "Loading...",
    Task_createDate: "Loading...",
    Task_owner: "Loading...",
    Task_notes: "Loading..."
  })
  const [notes, setNotes] = useState("")
  const [selectedplan, setselectedplan] = useState("None")

  // manage rendering
  const [planlist, setplanlist] = useState([])
  const [isAuth, setIsAuth] = useState(false)
  const [error, setError] = useState("")

  // get taskData on load, and check if user is permitted
  useEffect(() => {
    const fetchTask = async () => {
      console.log("fetch single task is loaded")
      try {
        // Make authorization request to the server
        const token = Cookies.get("token")
        var response = await Axios.post("/task", { Task_id: props.taskid, token })

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

        // set task details
        setTaskData(response.data.taskData)
        setselectedplan(response.data.taskData.Task_plan ? response.data.taskData.Task_plan : "None")
        console.log("task obtained: ", response.data.taskData)
        const taskstate = response.data.taskData.Task_state

        // fetch app permissions
        var response = await Axios.post("/app", { App_Acronym: props.appid, token })
        console.log("app obtained: ", response.data.appData)
        // permission switch case
        let appPermit
        switch (taskstate) {
          case "Open":
            appPermit = response.data.appData.App_permit_Open
            break
          case "Todolist":
            appPermit = response.data.appData.App_permit_toDoList
            break
          case "Doing":
            appPermit = response.data.appData.App_permit_Doing
            break
          case "Done":
            appPermit = response.data.appData.App_permit_Done
            break
          case "Closed":
            appPermit = null
            break
          default:
            appPermit = null
            break
        }
        if (!appPermit) {
          setIsAuth(false)
          return
        }

        // check if authorised to edit
        response = await Axios.post("/checkgroup", { groupname: appPermit, token })

        if (response.data.unauth) {
          console.log("unauthorised to edit task in this state")
          setIsAuth(false)
        } else {
          console.log("authorised to edit task in this state")
          setIsAuth(true)
        }
      } catch (error) {
        console.log("error: ", error)
      }
    }
    fetchTask()
  }, [])

  // get planlist on load
  useEffect(() => {
    console.log("plans useeffect called")
    const fetchPlans = async () => {
      try {
        // Make fetch request to the server
        const token = Cookies.get("token")
        const response = await Axios.post("/plan/getall", { appid: props.appid, token })
        // console.log("response ", response.data)

        // if not logged in
        if (response.data.unauth === "login") {
          appDispatch({
            type: "logout",
            message: "Logged out"
          })
          navigate("/login")
        }

        // Set the planlist based on the server response
        setplanlist(response.data.plansData)
        console.log("plans obtained: ", response.data.plansData)

        // console.log("plans obtained ", planlist)
      } catch (error) {
        console.error("Error fetching data:", error)
        // Handle errors as needed
      }
    }
    // Call the fetch function when the component mounts
    fetchPlans()
  }, [])

  // render planlist dropdown
  const renderplanlist = () => {
    return planlist.map((plan, index) => (
      <option key={index} value={plan.Plan_MVP_name}>
        {plan.Plan_MVP_name}
      </option>
    ))
  }

  // render plan date
  const renderplanDate = () => {
    if (selectedplan === "None") {
      return
    }
    const displayplan = planlist.filter(plan => plan.Plan_MVP_name === selectedplan)
    if (displayplan.length < 1) {
      return
    }
    console.log(displayplan[0])
    const startdate = displayplan[0].Plan_startDate ? displayplan[0].Plan_startDate : "Not Set"
    const enddate = displayplan[0].Plan_endDate ? displayplan[0].Plan_endDate : "Not Set"
    return (
      <span>
        {startdate} {enddate}
      </span>
    )
  }

  // change notes on input change
  const handleInputChange = e => {
    setNotes(e.target.value)
  }
  // change plan on input change
  const handlePlanChange = e => {
    setselectedplan(e.target.value)
  }

  // handle submit form
  // const handleSubmit = async e => {
  //   e.preventDefault()
  //   try {
  //     const token = Cookies.get("token")

  //     // send request
  //     const response = await Axios.post("/app/edit", { groupname: "Project Lead", formData, createPermit, openPermit, todolistPermit, doingPermit, donePermit, token })

  //     // if not logged in
  //     if (response.data.unauth === "login") {
  //       appDispatch({
  //         type: "logout",
  //         message: "Logged out"
  //       })
  //       navigate("/login")
  //       return
  //     }

  //     // if request fails
  //     if (response.data.error) {
  //       appDispatch({ type: "logerror", error: response.data.error })
  //       props.update()
  //       return
  //     }

  //     // else on success
  //     setError(false)
  //     appDispatch({
  //       type: "gtoast",
  //       message: "App successfully edited"
  //     })
  //     props.update()
  //   } catch (error) {
  //     console.log("error is ", error)
  //   }
  // }

  return (
    <Popup class="info-container" onClose={props.onClose} condition={props.onClose}>
      <form className="taskinfo-form">
        <div className="taskinfo-details">
          <b>ID</b>
          <span>{taskData.Task_id}</span>
          <b>App Acronym</b>
          <span>{taskData.Task_app_Acronym}</span>
          <b>State</b>
          <span>{taskData.Task_state}</span>
          <b>Create Date</b>
          <span>{taskData.Task_createDate}</span>
          <b>Creator</b>
          <span>{taskData.Task_creator}</span>
          <b>Owner</b>
          <span>{taskData.Task_owner}</span>
          <b>Plan</b>
          <select name="Task_plan" value={selectedplan} onChange={e => handlePlanChange(e)}>
            <option value="None">None</option>
            {renderplanlist()}
          </select>
          {selectedplan !== "None" && (
            <b>
              Start Date <br /> End Date
            </b>
          )}
          {renderplanDate()}

          <div className="flex-row" style={{ gridArea: "button" }}>
            <button type="button" className="backbutton" onClick={props.onClose}>
              Close
            </button>
            {isAuth && (
              <button type="button" className="gobutton">
                Save
              </button>
            )}
          </div>
        </div>
        <div className="taskinfo-content">
          <h2 style={{ width: "max-content" }}>{taskData.Task_name}</h2>
          <span>{taskData.Task_description}</span>
          <div className="taskinfo-log">{taskData.Task_notes}</div>
          <textarea name="Task_notes" placeholder="Add New Note" onChange={e => handleInputChange(e)}></textarea>
        </div>
      </form>
    </Popup>
  )
}

export default EditTask
