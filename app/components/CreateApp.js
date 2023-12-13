import React, { useContext, useEffect, useState } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import Cookies from "js-cookie"
import Axios from "axios"
import { useNavigate } from "react-router-dom"

function CreateApp(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  // state of fields
  const [formData, setFormData] = useState()
  const [openPermit, setOpenPermit] = useState()
  const [todolistPermit, setTodolistPermit] = useState()
  const [doingPermit, setDoingPermit] = useState()
  const [donePermit, setDonePermit] = useState()

  // manage rendering
  const [grouplist, setgrouplist] = useState([])
  const [error, setError] = useState("")

  // get grouplist on load
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        // Make fetch request to the server
        const token = Cookies.get("token")
        const response = await Axios.post("/group/getall", { token })
        // console.log("response ", response.data)

        // if not logged in
        if (response.data.unauth === "login") {
          appDispatch({
            type: "logout",
            message: "Logged out",
          })
          navigate("/login")
        }

        // Set the grouplist based on the server response
        const groups = response.data.groupsData.map((obj) => obj.groupname)
        const filteredGroups = groups.filter((groupName) => groupName !== "admin")

        setgrouplist(filteredGroups)

        // console.log("groups obtained ", grouplist)
      } catch (error) {
        console.error("Error fetching data:", error)
        // Handle errors as needed
      }
    }

    // Call the fetch function when the component mounts
    fetchGroups()
  }, [])

  // render grouplist dropdown
  const rendergrouplist = () => {
    return grouplist.map((group, index) => (
      <option key={index} value={group}>
        {group}
      </option>
    ))
  }

  // change formdata on input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }
  const handleOpenPermit = (e) => {
    setOpenPermit(e.target.value)
  }
  const handleTodolistPermit = (e) => {
    setTodolistPermit(e.target.value)
  }
  const handleDoingPermit = (e) => {
    setDoingPermit(e.target.value)
  }
  const handleDonePermit = (e) => {
    setDonePermit(e.target.value)
  }

  // handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = Cookies.get("token")

      // send request
      const response = await Axios.post("/app/create", { groupname: "Project Lead", formData, token })

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
          message: "App creation failed, please enter the App Acronym and App Rnumber",
        })
        props.update()
        return
      }
      if (!response.data.success && response.data.message === "conflict") {
        setError("conflict")
        appDispatch({
          type: "btoast",
          message: "App Acronym is already in use, please try again",
        })
        props.update()
        return
      }
      // else on success
      setError(false)
      appDispatch({
        type: "gtoast",
        message: "App successfully created",
      })
      props.update()
    } catch (error) {
      console.log("error is ", error)
    }
  }

  return (
    <div className="appinfo-container">
      <h2 style={{ width: "max-content" }}>Create App - Configurations</h2>
      <form onSubmit={handleSubmit} className="appinfo-form">
        <label style={{ gridArea: "acronym-title" }}>App Acronym</label>
        <input style={{ gridArea: "acronym" }} type="text" name="App_Acronym" onChange={(e) => handleInputChange(e)} />

        <label style={{ gridArea: "rnumber-title" }}>App rnumber</label>
        <input
          style={{ gridArea: "rnumber" }}
          type="number"
          name="App_Rnumber"
          min="0"
          step="1"
          onInput={(e) => {
            if (!/^[0-9]+$/.test(e.target.value)) e.target.value = formData.App_Rnumber
          }}
          onChange={(e) => handleInputChange(e)}
        />

        <label style={{ gridArea: "startdate-title" }}>From</label>
        <input style={{ gridArea: "startdate" }} type="date" name="App_startDate" onChange={(e) => handleInputChange(e)} />

        <label style={{ gridArea: "enddate-title" }}>To</label>
        <input style={{ gridArea: "enddate" }} type="date" name="App_endDate" onChange={(e) => handleInputChange(e)} />

        <label style={{ gridArea: "desc-title" }}>App Description</label>
        <textarea style={{ gridArea: "desc", resize: "none", width: "100%", height: "100%" }} name="App_Description" onChange={(e) => handleInputChange(e)}></textarea>

        <label style={{ gridArea: "open-title" }}>Open State Permissions</label>
        <select value={openPermit} onChange={(e) => handleOpenPermit(e)} style={{ gridArea: "open" }} name="App_permit_Open">
          {rendergrouplist()}
        </select>

        <label style={{ gridArea: "todolist-title" }}>To Do List State Permissions</label>
        <select value={todolistPermit} onChange={(e) => handleTodolistPermit(e)} style={{ gridArea: "todolist" }} name="App_permit_toDoList">
          {rendergrouplist()}
        </select>

        <label style={{ gridArea: "doing-title" }}>Doing State Permissions</label>
        <select value={doingPermit} onChange={(e) => handleDoingPermit(e)} style={{ gridArea: "doing" }} name="App_permit_Doing">
          {rendergrouplist()}
        </select>

        <label style={{ gridArea: "done-title" }}>Done State Permissions</label>
        <select value={donePermit} onChange={(e) => handleDonePermit(e)} style={{ gridArea: "done" }} name="App_permit_Done">
          {rendergrouplist()}
        </select>

        <div className="flex-row" style={{ gridArea: "button" }}>
          <button type="button" onClick={props.onClose}>
            Close
          </button>
          <button type="button" onClick={handleSubmit}>
            Create
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateApp
