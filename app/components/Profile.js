import React, { useContext, useEffect, useRef, useState } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import Cookies from "js-cookie"
import Axios from "axios"
import { useNavigate } from "react-router-dom"

function Profile() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()
  const popupRef = useRef(null)

  // state of fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // closes profile overlay if clicked outside
  useEffect(() => {
    const handleOutsideClick = event => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        console.log("detected outside click")
        appDispatch({ type: "closeprofile" })
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [appState.overlay])

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
            message: "Logged out"
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
  const handleEdit = async e => {
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
    <div className="profile" ref={popupRef}>
      <h2 style={{ width: "max-content" }}>Update Personal Details</h2>
      <form onSubmit={handleEdit} style={{ display: "flex", flexDirection: "column" }}>
        <label>
          Username: <br />
          <input type="text" value={appState.user} style={{ border: "none" }} readOnly />
        </label>
        <label htmlFor="email">
          Update Email:
          <input type="text" name="email" value={email} placeholder="email" onChange={e => setEmail(e.target.value)} />
        </label>
        <label htmlFor="password">
          Change Password:
          <input type="password" name="password" placeholder="password" className={error ? "error-outline" : undefined} onChange={e => setPassword(e.target.value)} />
        </label>
        <button type="reset" onClick={handleEdit}>
          Update
        </button>
      </form>
    </div>
  )
}

export default Profile
