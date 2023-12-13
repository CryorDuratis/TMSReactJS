import React, { useContext, useEffect, useRef, useState } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import Cookies from "js-cookie"
import Axios from "axios"
import { useNavigate } from "react-router-dom"

function EditApp(props) {
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

  // set default formdata on load
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
        setgrouplist(response.data.groupsData.map(obj => obj.groupname))

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

      // password validation
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\\/-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\\/-]{8,10}$/

      if (!passwordRegex.test(password) && password.length > 0) {
        setError("invalid")
        appDispatch({
          type: "btoast",
          message: "Password must have letters, numbers and special characters, and 8-10 characters long"
        })
        return
      }
      // send request -- edit
      const requestbody = { token }
      if (password.length > 0) {
        requestbody.password = password
      }
      if (email.length > 0) {
        requestbody.email = email
      }
      const response = await Axios.post("/user/editSelf", requestbody)

      // if not logged in
      if (response.data.unauth === "login") {
        appDispatch({
          type: "logout",
          message: "Logged out"
        })
        navigate("/login")
        return
      }

      // if request fails
      if (response.data.error) {
        appDispatch({ type: "logerror", error: response.data.error })
        return
      }
      // if edit fails
      if (!response.data.success) {
        setError("invalid")
        appDispatch({
          type: "btoast",
          message: "Password must have letters, numbers and special characters, and 8-10 characters long"
        })
        return
      }
      // else on success
      setError(false)
      appDispatch({
        type: "gtoast",
        message: "Personal details updated"
      })
    } catch (error) {
      console.log("error is ", error)
    }
  }

  return (
    <div className="appinfo-container">
      <h2 style={{ width: "max-content" }}>Create App - Configurations</h2>
      <form onSubmit={handleSubmit} className="appinfo-form">
        <label style={{ gridArea: "acronym-title" }}>App Acronym</label>
        <input style={{ gridArea: "acronym" }} type="text" onChange={e => handleInputChange(e)} />

        <label style={{ gridArea: "rnumber-title" }}>App rnumber</label>
        <input style={{ gridArea: "rnumber" }} type="text" onChange={e => handleInputChange(e)} />

        <label style={{ gridArea: "startdate-title" }}>From</label>
        <input style={{ gridArea: "startdate" }} type="text" onChange={e => handleInputChange(e)} />

        <label style={{ gridArea: "enddate-title" }}>To</label>
        <input style={{ gridArea: "enddate" }} type="text" onChange={e => handleInputChange(e)} />

        <label style={{ gridArea: "desc-title" }}>App Description</label>
        <textarea style={{ gridArea: "desc", resize: "none", width: "100%", height: "100%" }} name="description" onChange={e => handleInputChange(e)}></textarea>

        <label style={{ gridArea: "open-title" }}>Open State</label>
        <select onChange={e => handleOpenPermit(e)} style={{ gridArea: "open" }} name="open">
          {rendergrouplist()}
        </select>

        <label style={{ gridArea: "todolist-title" }}>To Do List State</label>
        <select onChange={e => handleTodolistPermit(e)} style={{ gridArea: "todolist" }} name="todolist">
          {rendergrouplist()}
        </select>

        <label style={{ gridArea: "doing-title" }}>Doing State</label>
        <select onChange={e => handleDoingPermit(e)} style={{ gridArea: "doing" }} name="doing">
          {rendergrouplist()}
        </select>

        <label style={{ gridArea: "done-title" }}>Done State</label>
        <select onChange={e => handleDonePermit(e)} style={{ gridArea: "done" }} name="done">
          {rendergrouplist()}
        </select>

        <div className="flex-row" style={{ gridArea: "button" }}>
          <button type="button" onClick={props.onClose}>
            Close
          </button>
          <button type="reset">Clear</button>
          <button type="button">Create</button>
        </div>
      </form>
    </div>
  )
}

export default EditApp
