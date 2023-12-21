import React, { useContext, useEffect, useState } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import Cookies from "js-cookie"
import Axios from "axios"
import { useNavigate } from "react-router-dom"
import Popup from "./Popup"

function EditApp(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  // state of fields
  const [formData, setFormData] = useState()
  const [createPermit, setCreatePermit] = useState()
  const [openPermit, setOpenPermit] = useState()
  const [todolistPermit, setTodolistPermit] = useState()
  const [doingPermit, setDoingPermit] = useState()
  const [donePermit, setDonePermit] = useState()

  // manage rendering
  const [isLoading, setIsLoading] = useState(true)
  const [grouplist, setgrouplist] = useState([])
  const [isAuth, setIsAuth] = useState(false)
  const [error, setError] = useState("")

  const fetchApp = async () => {
    console.log("fetch single app is loaded")
    try {
      // Make authorization request to the server
      const token = Cookies.get("token")
      var response = await Axios.post("/app", { App_Acronym: props.appacro, token })

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

      // set apps
      setFormData(response.data.appData)
      setCreatePermit(response.data.appData.App_permit_Create ? response.data.appData.App_permit_Create : grouplist[0])
      setOpenPermit(response.data.appData.App_permit_Open ? response.data.appData.App_permit_Open : grouplist[0])
      setTodolistPermit(response.data.appData.App_permit_toDoList ? response.data.appData.App_permit_toDoList : grouplist[0])
      setDoingPermit(response.data.appData.App_permit_Doing ? response.data.appData.App_permit_Doing : grouplist[0])
      setDonePermit(response.data.appData.App_permit_Done ? response.data.appData.App_permit_Done : grouplist[0])
      console.log("app obtained: ", response.data.appData)

      // check if authorised to edit
      response = await Axios.post("/checkgroup", { groupname: "Project Lead", token })

      if (response.data.unauth) {
        setIsAuth(false)
      } else {
        setIsAuth(true)
      }

      setIsLoading(false)
    } catch (error) {
      console.log("error: ", error)
    }
  }

  // set default formdata on load, and check if user is permitted
  useEffect(() => {
    fetchApp()
  }, [])

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
            message: "Logged out"
          })
          navigate("/login")
        }

        // Set the grouplist based on the server response
        const groups = response.data.groupsData.map(obj => obj.groupname)
        const filteredGroups = groups.filter(groupName => groupName !== "admin")

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
  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }
  const handleCreatePermit = e => {
    setCreatePermit(e.target.value)
  }
  const handleOpenPermit = e => {
    setOpenPermit(e.target.value)
  }
  const handleTodolistPermit = e => {
    setTodolistPermit(e.target.value)
  }
  const handleDoingPermit = e => {
    setDoingPermit(e.target.value)
  }
  const handleDonePermit = e => {
    setDonePermit(e.target.value)
  }

  // handle submit form
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const token = Cookies.get("token")

      // send request
      const response = await Axios.post("/app/edit", { groupname: "Project Lead", formData, createPermit, openPermit, todolistPermit, doingPermit, donePermit, token })

      // if not logged in
      if (response.data.unauth) {
        if (response.data.unauth === "login") {
          appDispatch({
            type: "logout",
            message: "Logged out"
          })
          navigate("/login")
        } else if (response.data.unauth === "role") {
          appDispatch({ type: "btoast", message: "Unauthorized" })
          props.update()
          fetchApp()
        }
        return
      }

      // if request fails
      if (response.data.error) {
        appDispatch({ type: "error", error: response.data.error })
        props.update()
        return
      }

      // else on success
      setError(false)
      appDispatch({
        type: "gtoast",
        message: "App successfully edited"
      })
      props.update()
    } catch (error) {
      console.log("error is ", error)
    }
  }

  return (
    <Popup class="info-container" onClose={props.onClose} condition={props.onClose}>
      <h2 style={{ width: "max-content" }}>{isAuth ? "Edit App Details" : "View App Details"}</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="appinfo-form">
          <label style={{ gridArea: "acronym-title" }}>App Acronym</label>
          <input style={{ gridArea: "acronym" }} type="text" name="App_Acronym" disabled value={formData.App_Acronym} />

          <label style={{ gridArea: "rnumber-title" }}>App rnumber</label>
          <input style={{ gridArea: "rnumber" }} type="number" name="App_Rnumber" disabled value={formData.App_Rnumber} />

          <label style={{ gridArea: "startdate-title" }}>From</label>
          <input style={{ gridArea: "startdate" }} type="date" name="App_startDate" disabled={!isAuth} value={formData.App_startDate ? formData.App_startDate : ""} onChange={e => handleInputChange(e)} />

          <label style={{ gridArea: "enddate-title" }}>To</label>
          <input style={{ gridArea: "enddate" }} type="date" name="App_endDate" disabled={!isAuth} value={formData.App_endDate ? formData.App_endDate : ""} onChange={e => handleInputChange(e)} />

          <label style={{ gridArea: "desc-title" }}>App Description</label>
          <textarea style={{ gridArea: "desc" }} name="App_Description" disabled={!isAuth} value={formData.App_Description ? formData.App_Description : ""} onChange={e => handleInputChange(e)}></textarea>

          <label style={{ gridArea: "create-title" }}>Create Task Permissions</label>
          <select disabled={!isAuth} value={createPermit} onChange={e => handleCreatePermit(e)} style={{ gridArea: "create" }} name="App_permit_Create">
            {rendergrouplist()}
          </select>

          <label style={{ gridArea: "open-title" }}>Open State Permissions</label>
          <select disabled={!isAuth} value={openPermit} onChange={e => handleOpenPermit(e)} style={{ gridArea: "open" }} name="App_permit_Open">
            {rendergrouplist()}
          </select>

          <label style={{ gridArea: "todolist-title" }}>To Do List State Permissions</label>
          <select disabled={!isAuth} value={todolistPermit} onChange={e => handleTodolistPermit(e)} style={{ gridArea: "todolist" }} name="App_permit_toDoList">
            {rendergrouplist()}
          </select>

          <label style={{ gridArea: "doing-title" }}>Doing State Permissions</label>
          <select disabled={!isAuth} value={doingPermit} onChange={e => handleDoingPermit(e)} style={{ gridArea: "doing" }} name="App_permit_Doing">
            {rendergrouplist()}
          </select>

          <label style={{ gridArea: "done-title" }}>Done State Permissions</label>
          <select disabled={!isAuth} value={donePermit} onChange={e => handleDonePermit(e)} style={{ gridArea: "done" }} name="App_permit_Done">
            {rendergrouplist()}
          </select>

          <div className="flex-row" style={{ gridArea: "button" }}>
            <button type="button" className="backbutton" onClick={props.onClose}>
              Close
            </button>
            {isAuth && (
              <button type="button" className="gobutton" onClick={handleSubmit}>
                Save
              </button>
            )}
          </div>
        </form>
      )}
    </Popup>
  )
}

export default EditApp
