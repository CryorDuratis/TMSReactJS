import React, { useContext, useEffect, useRef, useState } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import Cookies from "js-cookie"
import Axios from "axios"
import { useNavigate } from "react-router-dom"
import Popup from "./Popup"

function AppInfo(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  // state of fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // set default formdata on load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Make fetch request to the server
        const token = Cookies.get("token")
        const response = await Axios.post("/user", { token })

        // if not logged in
        if (response.data.unauth === "login") {
          appDispatch({
            type: "logout",
            message: "Logged out",
          })
          navigate("/login")
          return
        }

        // Set the email based on the server response
        setEmail(response.data.email)
      } catch (error) {
        console.error("Error fetching data:", error)
        // Handle errors as needed
      }
    }
    // Call the fetch function when the component mounts
    fetchUser()
  }, [])

  // handle submit edit form
  const handleEdit = async (e) => {
    e.preventDefault()
    try {
      const token = Cookies.get("token")

      // password validation
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\\/-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\\/-]{8,10}$/

      if (!passwordRegex.test(password) && password.length > 0) {
        setError("invalid")
        appDispatch({
          type: "btoast",
          message: "Password must have letters, numbers and special characters, and 8-10 characters long",
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
          message: "Logged out",
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
          message: "Password must have letters, numbers and special characters, and 8-10 characters long",
        })
        return
      }
      // else on success
      setError(false)
      appDispatch({
        type: "gtoast",
        message: "Personal details updated",
      })
    } catch (error) {
      console.log("error is ", error)
    }
  }

  return (
    <div className="appinfo-container">
      <h2 style={{ width: "max-content" }}>Create App - Configurations</h2>
      <form onSubmit={handleEdit} className="appinfo-form">
        <label style={{ gridArea: "acronym-title" }}>App Acronym</label>
        <input style={{ gridArea: "acronym" }} type="text" value={"test"} />
        <label style={{ gridArea: "rnumber-title" }}>App rnumber</label>
        <input style={{ gridArea: "rnumber" }} type="text" value={"test"} />
        <label style={{ gridArea: "startdate-title" }}>From</label>
        <input style={{ gridArea: "startdate" }} type="text" value={"test"} />
        <label style={{ gridArea: "enddate-title" }}>To</label>
        <input style={{ gridArea: "enddate" }} type="text" value={"test"} />
        <label style={{ gridArea: "desc-title" }}>App Description</label>
        <textarea style={{ gridArea: "desc", resize: "none", width: "100%", height: "100%" }} name="description"></textarea>

        <label style={{ gridArea: "create-title" }}>Create Tasks</label>
        <select style={{ gridArea: "create" }} name="create">
          <option value="test">test</option>
          <option value="test2">test2</option>
          <option value="test3">test3</option>
        </select>
        <label style={{ gridArea: "open-title" }}>Open State</label>
        <select style={{ gridArea: "open" }} name="open">
          <option value="test">test</option>
          <option value="test2">test2</option>
          <option value="test3">test3</option>
        </select>
        <label style={{ gridArea: "todolist-title" }}>To Do List State</label>
        <select style={{ gridArea: "todolist" }} name="todolist">
          <option value="test">test</option>
          <option value="test2">test2</option>
          <option value="test3">test3</option>
        </select>
        <label style={{ gridArea: "doing-title" }}>Doing State</label>
        <select style={{ gridArea: "doing" }} name="doing">
          <option value="test">test</option>
          <option value="test2">test2</option>
          <option value="test3">test3</option>
        </select>
        <label style={{ gridArea: "done-title" }}>Done State</label>
        <select style={{ gridArea: "done" }} name="done">
          <option value="test">test</option>
          <option value="test2">test2</option>
          <option value="test3">test3</option>
        </select>
        <div className="flex-row" style={{ gridArea: "button" }}>
          <button type="button" onClick={props.onClose}>
            Close
          </button>
          <button type="button">Create</button>
        </div>
      </form>
    </div>
  )
}

export default AppInfo
