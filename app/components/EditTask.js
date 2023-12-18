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
  const [formData, setFormData] = useState()

  // manage rendering
  const [isLoading, setIsLoading] = useState(true)
  const [planlist, setplanlist] = useState([])
  const [isAuth, setIsAuth] = useState(false)
  const [error, setError] = useState("")

  // set default formdata on load, and check if user is permitted
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
        setFormData(response.data.taskData)
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

        setIsLoading(false)
      } catch (error) {
        console.log("error: ", error)
      }
    }
    fetchTask()
  }, [])

  // get planlist on load
  useEffect(() => {
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

        // console.log("plans obtained ", planlist)
      } catch (error) {
        console.error("Error fetching data:", error)
        // Handle errors as needed
      }
    }
    // Call the fetch function when the component mounts
    fetchPlans()
  }, [])

  // render grouplist dropdown
  const renderplanlist = () => {
    return planlist.map((plan, index) => (
      <option key={index} value={plan}>
        {plan}
      </option>
    ))
  }

  // change formdata on input change
  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
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
      <h2 style={{ width: "max-content" }}>{isAuth ? "Edit Task" : "View Task Details"}</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form className="taskinfo-form">
          <label>App Acronym</label>
          <input type="text" name="App_Acronym" disabled value={formData.App_Acronym} />

          <label>App rnumber</label>
          <input type="number" name="App_Rnumber" disabled value={formData.App_Rnumber} />

          <label>From</label>
          <input type="date" name="App_startDate" disabled={!isAuth} value={formData.App_startDate} onChange={e => handleInputChange(e)} />

          <label>To</label>
          <input type="date" name="App_endDate" disabled={!isAuth} value={formData.App_endDate} onChange={e => handleInputChange(e)} />

          <label>App Description</label>
          <textarea name="App_Description" disabled={!isAuth} value={formData.App_Description ? formData.App_Description : ""} onChange={e => handleInputChange(e)}></textarea>

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
        </form>
      )}
    </Popup>
  )
}

export default EditTask
