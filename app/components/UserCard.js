// import node modules
import React, { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Axios from "axios"

// import components
import Container from "./Container"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import Popup from "./Popup"
import Cookies from "js-cookie"

function UserCard(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  // state of fields
  const [formData, setFormData] = useState(props.user)
  const [password, setPassword] = useState("")
  const [selectedRoles, setSelectedRoles] = useState(formData.role)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [error, setError] = useState("")
  const editkey = props.listkey + 1
  const buttonRef = useRef(null)

  // set default formdata and close popup if not editing current user
  useEffect(() => {
    console.log("editing changed ", props.editing)
    if (!props.create) {
      if (props.editing !== editkey) {
        setIsPopupOpen(false)
        setFormData(props.user)
        setPassword("")
        setSelectedRoles(props.user.role)
      }
      // close popup
    }
  }, [props.editing])

  // set editing to this item
  const handleClick = async (e) => {
    e.preventDefault()
    props.setEditing(editkey)
  }

  // submit to backend and update user list state
  const handleUpdate = async (e) => {
    e.preventDefault()
    console.log("selectedroles: ", selectedRoles)

    // submit edit
    if (props.editing === editkey) {
      props.setEditing(0)
      console.log("edit form was submitted")
      try {
        const { username, email } = formData
        const role = selectedRoles ? selectedRoles : ""

        const token = Cookies.get("token")

        // password validation
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\\/-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\\/-]{8,10}$/

        if (!passwordRegex.test(password) && password.length > 0) {
          setError("invalid")
          appDispatch({
            type: "btoast",
            message: "Password must have letters, numbers and special characters, and 8-10 characters long",
          })
          props.update()
          return
        }

        // send request -- edit
        const requestbody = { groupname: "admin", username, email, role, token }
        if (password.length > 0) {
          requestbody.password = password
        }
        const response = await Axios.post("/user/edit", requestbody)

        // if not logged in
        if (response.data.unauth) {
          if (response.data.unauth === "login") {
            appDispatch({
              type: "logout",
              message: "Logged out",
            })
            navigate("/login")
          } else if (response.data.unauth === "role") {
            appDispatch({ type: "btoast", message: "Unauthorized page, redirecting to home" })
            navigate("/")
          }
          props.update()
          return
        }

        // if request fails
        if (response.data.error) {
          appDispatch({ type: "logerror", error: response.data.error })
          props.update()
          return
        }
        // if edit fails
        if (!response.data.success) {
          setError("invalid")
          appDispatch({
            type: "btoast",
            message: "Password must have letters, numbers and special characters, and 8-10 characters long",
          })
          props.update()
          return
        }
        // else on success
        setError(false)
        appDispatch({
          type: "gtoast",
          message: "User account edited successfully",
        })
      } catch (e) {
        console.log(e)
      }
    }
    // submit create
    if (props.create) {
      console.log("create form was submitted")
      try {
        const { username, email } = formData
        const role = selectedRoles ? selectedRoles : ""

        const token = Cookies.get("token")
        // if required fields blank
        if (!username || !password) {
          setError("required")
          appDispatch({
            type: "btoast",
            message: "Username and Password are required",
          })
          props.update()
          return
        }
        // password validation
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\\/-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\\/-]{8,10}$/

        if (!passwordRegex.test(password)) {
          setError("invalid")
          appDispatch({
            type: "btoast",
            message: "Password must have letters, numbers and special characters, and 8-10 characters long",
          })
          props.update()
          return
        }

        // send request -- create
        const response = await Axios.post("/user/create", { groupname: "admin", username, password, email, role, token })

        // if not logged in
        if (response.data.unauth) {
          if (response.data.unauth === "login") {
            appDispatch({
              type: "logout",
              message: "Logged out",
            })
            navigate("/login")
          } else if (response.data.unauth === "role") {
            appDispatch({ type: "btoast", message: "Unauthorized page, redirecting to home" })
            navigate("/")
          }
          props.update()
          return
        }

        // if request fails
        if (response.data.error) {
          appDispatch({ type: "logerror", error: response.data.error })
          props.update()
          return
        }
        // if create fails
        if (!response.data.success) {
          setError("conflict")
          appDispatch({
            type: "btoast",
            message: "Username already exists",
          })
          props.update()
          return
        }
        // else on success
        setError(false)
        appDispatch({
          type: "gtoast",
          message: "New user created successfully",
        })
      } catch (e) {
        console.log(e)
      }
    }
    setPassword("")
    props.update()
  }

  // set default form data if canceled or cleared
  const handleCancel = (e) => {
    setFormData(props.user)
    setPassword("")
    setSelectedRoles(props.user.role)
    if (!props.create) {
      props.setEditing(0)
    }
  }

  // updates form values for axios submission since single page react cant use default form actions
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  // pass to each user form to handle roles in a multiselect dropdown
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen)
  }
  const handleClosePopup = () => {
    // close popup
    setIsPopupOpen(false)
  }

  return (
    <Container listkey={props.listkey} class={props.class}>
      <form className="user-form">
        <input type="text" name="username" value={formData.username} disabled={!props.create} onChange={(e) => handleInputChange(e)} className={error ? "form-username error-outline" : "form-username"} />

        <input type="password" name="password" value={password} placeholder="********" disabled={props.editing !== editkey && !props.create} onChange={(e) => setPassword(e.target.value)} className={error ? "form-password error-outline" : "form-password"} />

        <input type="text" name="email" value={formData.email} disabled={props.editing !== editkey && !props.create} onChange={(e) => handleInputChange(e)} className="form-email" />

        <div className="form-role">
          <button type="button" name="role" value={selectedRoles ? selectedRoles : "user"} disabled={props.editing !== editkey && !props.create} onClick={(e) => togglePopup(e)}>
            {selectedRoles ? selectedRoles : "user"} {props.editing === editkey || props.create ? <>&#9660;</> : ""}
          </button>
          <Popup isOpen={isPopupOpen} onClose={handleClosePopup} buttonRef={buttonRef} roles={selectedRoles} setRoles={setSelectedRoles} />
        </div>

        <select className="form-status" name="isactive" value={formData.isactive.toString() === "1" ? "1" : "0"} disabled={props.editing !== editkey} onChange={(e) => handleInputChange(e)}>
          <option value="1">Active</option>
          <option value="0">Disabled</option>
        </select>

        <div className="form-cancel">
          {props.editing === editkey ? (
            <button type="reset" onClick={(e) => handleCancel(e)}>
              Cancel
            </button>
          ) : (
            props.create && (
              <button type="reset" onClick={(e) => handleCancel(e)}>
                Clear
              </button>
            )
          )}
        </div>

        <div className="form-edit">
          {props.editing === editkey ? (
            <button type="submit" onClick={(e) => handleUpdate(e)}>
              Update
            </button>
          ) : (
            <button type="button" onClick={props.create ? (e) => handleUpdate(e) : (e) => handleClick(e)}>
              {props.create ? "Create" : "Edit"}
            </button>
          )}
        </div>
      </form>
    </Container>
  )
}

export default UserCard
