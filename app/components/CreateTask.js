import React, { useContext, useEffect, useState } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import Cookies from "js-cookie"
import Axios from "axios"
import { useNavigate } from "react-router-dom"
import Popup from "./Popup"

function CreateTask(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  // state of fields
  const [formData, setFormData] = useState({
    Task_name: "",
    Task_id: "",
    Task_app_Acronym: props.appid,
    Task_description: "",
  })

  // manage rendering
  const [error, setError] = useState("")

  // change formdata on input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  // get taskid
  useEffect(() => {
    const fetchapp = async () => {
      try {
        // Make fetch request to the server
        const token = Cookies.get("token")
        var response = await Axios.post("/app", { App_Acronym: props.appid, token })
        // console.log("response ", response.data)

        // if not logged in
        if (response.data.unauth) {
          console.log("user is unauth")
          appDispatch({
            type: "logout",
            message: "Logged out",
          })
          navigate("/login")
          return
        }

        // get app rnum
        const rnum = response.data.appData.App_Rnumber
        // set default taskid
        const taskid = props.appid + "_" + rnum
        setFormData((prevData) => ({
          ...prevData,
          ["Task_id"]: taskid,
        }))

        // fetch app permissions
        response = await Axios.post("/app", { App_Acronym: props.appid, token })
        const createpermit = response.data.appData.App_permit_Create

        // check auth
        response = await Axios.post("/checkgroup", { groupname: createpermit, token })
        if (response.data.unauth) {
          props.setIsAuth("")
          appDispatch({
            type: "btoast",
            message: "Unauthorised action",
          })
          props.onClose()
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        // Handle errors as needed
      }
    }
    fetchapp()
  }, [])

  // handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log("values sent in: ", formData)
    try {
      const token = Cookies.get("token")

      // send request
      const response = await Axios.post("/task/create", { formData, token })

      // if not logged in
      if (response.data.unauth === "login") {
        appDispatch({
          type: "logout",
          message: "Logged out",
        })
        navigate("/login")
        return
      }

      // if request fails
      if (response.data.error) {
        appDispatch({ type: "logerror", error: response.data.error })
        props.update()
        return
      }
      // if create fails
      if (!response.data.success && response.data.message === "required") {
        setError("required")
        appDispatch({
          type: "btoast",
          message: "Task creation failed, please enter the Task name",
        })
        props.update()
        return
      }
      if (!response.data.success && response.data.message === "conflict") {
        setError("conflict")
        appDispatch({
          type: "btoast",
          message: "Task name is already in use, please try again",
        })
        props.update()
        return
      }
      // else on success
      setError(false)
      appDispatch({
        type: "gtoast",
        message: "Task successfully created",
      })
      props.update()
      props.onClose()
    } catch (error) {
      console.log("error is ", error)
    }
  }

  return (
    <Popup class="info-container" onClose={props.onClose} condition={props.onClose}>
      <h2 style={{ width: "max-content" }}>Create Task</h2>
      <form onSubmit={handleSubmit} className="create-task-form">
        <label htmlFor="Task_name">Task Name</label>
        <input type="text" name="Task_name" onChange={(e) => handleInputChange(e)} className={error ? "error-outline" : undefined} />

        <label htmlFor="Task_id">Task ID</label>
        <input type="text" name="Task_id" value={formData.Task_id} disabled />

        <label htmlFor="Task_app_Acronym">App Acronym</label>
        <input type="text" name="Task_app_Acronym" value={props.appid} disabled />

        <label>Task Description</label>
        <textarea name="Task_description" onChange={(e) => handleInputChange(e)}></textarea>

        <div className="flex-row" style={{ gridArea: "button", marginTop: "20px", justifySelf: "end" }}>
          <button type="button" className="backbutton" onClick={props.onClose}>
            Close
          </button>
          <button type="button" className="gobutton" onClick={handleSubmit}>
            Create
          </button>
        </div>
      </form>
    </Popup>
  )
}

export default CreateTask
