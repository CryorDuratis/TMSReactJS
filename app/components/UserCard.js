// import node modules
import React, { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Axios from "axios"

// import components
import Container from "../templates/Container"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import Popup from "./Popup"
import Cookies from "js-cookie"

function UserCard(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  // state of fields
  var defaultuser = {}
  if (props.listkey) {
    defaultuser = props.userlist[props.listkey]
  } else defaultuser = props.user

  // formdata handles optional fields that are retrieved from db
  const [formData, setFormData] = useState(defaultuser)
  // password is optional field but not retrieved from data
  const [password, setPassword] = useState("")
  // role is optional field, with default field if empty
  const [selectedRoles, setSelectedRoles] = useState(defaultuser.role !== "" ? defaultuser.role : "user")

  // managing rendering
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [error, setError] = useState("")
  const buttonRef = useRef(null)
  const editkey = props.listkey + 1 // so that 0 can be set as nothing is editing

  // set default formdata and close popup if not editing current user
  useEffect(() => {
    console.log("editing changed ", props.editing)
    if (!props.create) {
      if (props.editing !== editkey) {
        setIsPopupOpen(false)
        setFormData(defaultuser)
        setPassword("")
        setSelectedRoles(defaultuser.role !== "" ? defaultuser.role : "user")
      }
      // close popup
    }
  }, [props.editing, props.userlist])

  // set editing to this item
  const handleClick = async e => {
    e.preventDefault()
    props.setEditing(editkey)
  }

  // submit to backend and update user list state
  const handleUpdate = async e => {
    e.preventDefault()
    console.log("selectedroles: ", selectedRoles)

    // submit edit
    if (props.editing === editkey) {
      props.setEditing(0)
      console.log("edit form was submitted")
      try {
        const { username, email, isactive } = formData
        const role = selectedRoles

        const token = Cookies.get("token")

        // password validation
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\\/-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\\/-]{8,10}$/

        if (!passwordRegex.test(password) && password.length > 0) {
          setError("invalid")
          appDispatch({
            type: "btoast",
            message: "Password must have letters, numbers and special characters, and 8-10 characters long"
          })
          props.update()
          return
        }

        // send request -- edit
        const requestbody = { groupname: "admin", username, email, role, token, isactive }
        if (password.length > 0) {
          requestbody.password = password
        }
        const response = await Axios.post("/user/edit", requestbody)

        // if not logged in
        if (response.data.unauth) {
          if (response.data.unauth === "login") {
            appDispatch({
              type: "logout",
              message: "Logged out"
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
            message: "Password must have letters, numbers and special characters, and 8-10 characters long"
          })
          props.update()
          return
        }
        // else on success
        setError(false)
        appDispatch({
          type: "gtoast",
          message: "User account edited successfully"
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
        const role = selectedRoles

        const token = Cookies.get("token")
        // if required fields blank
        if (!username || !password) {
          setError("required")
          appDispatch({
            type: "btoast",
            message: "Username and Password are required"
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
            message: "Password must have letters, numbers and special characters, and 8-10 characters long"
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
              message: "Logged out"
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
            message: "Username already exists"
          })
          props.update()
          return
        }
        // else on success
        setError(false)
        appDispatch({
          type: "gtoast",
          message: "New user created successfully"
        })
      } catch (e) {
        console.log(e)
      }
    }
    setPassword("")
    props.update()
  }

  // set default form data if canceled or cleared
  const handleCancel = e => {
    setFormData(defaultuser)
    setPassword("")
    setSelectedRoles(defaultuser.role !== "" ? defaultuser.role : "user")
    if (!props.create) {
      props.setEditing(0)
    }
  }

  // updates form values for axios submission since single page react cant use default form actions
  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }
  // update selected list array (form value for roles)
  const handleCheckboxChange = event => {
    const value = event.target.value

    var checkedRoles = selectedRoles.split(",").filter(selected => selected !== "user") // converted to array, removed user element
    if (checkedRoles.includes(value)) {
      checkedRoles = checkedRoles.filter(selected => selected !== value)
    } else {
      checkedRoles.push(value)
    }
    // set selectroles string back based on checked values
    if (checkedRoles.length > 0) setSelectedRoles(checkedRoles.join(","))
    else setSelectedRoles("user")
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
    <form className="user-form">
      <input type="text" name="username" value={formData.username} disabled={!props.create} onChange={e => handleInputChange(e)} title={formData.username} className={error ? "form-username error-outline" : "form-username"} />

      <input type="password" name="password" value={password} placeholder="********" disabled={props.editing !== editkey && !props.create} onChange={e => setPassword(e.target.value)} className={error ? "form-password error-outline" : "form-password"} />

      <input type="text" name="email" value={formData.email} disabled={props.editing !== editkey && !props.create} onChange={e => handleInputChange(e)} className="form-email" />

      <div className="form-role">
        <button type="button" name="role" value={selectedRoles !== "" ? selectedRoles : "user"} disabled={props.editing !== editkey && !props.create} onClick={e => togglePopup(e)}>
          <span>{selectedRoles !== "" ? selectedRoles : "user"}</span> {props.editing === editkey || props.create ? <>&#9660;</> : ""}
        </button>
        {isPopupOpen && (
          <Popup class="popup" onClose={handleClosePopup} condition={handleClosePopup}>
            Select Roles:
            <br />
            {props.grouplist.map((groupname, index) => (
              <label key={index} style={{ display: "flex", flexDirection: "row" }}>
                <input type="checkbox" name="roles" value={groupname} checked={new RegExp(`\\b${groupname}\\b`).test(selectedRoles)} onChange={handleCheckboxChange} /> {groupname}
              </label>
            ))}
          </Popup>
        )}
      </div>

      <select className="form-status" name="isactive" value={formData.isactive.toString() === "1" ? "1" : "0"} disabled={props.editing !== editkey} onChange={e => handleInputChange(e)}>
        <option value="1">Active</option>
        <option value="0">Disabled</option>
      </select>

      <div className="form-cancel">
        {props.editing === editkey ? (
          <button type="reset" onClick={e => handleCancel(e)} className="backbutton">
            Cancel
          </button>
        ) : (
          props.create && (
            <button type="reset" onClick={e => handleCancel(e)} className="backbutton">
              Clear
            </button>
          )
        )}
      </div>

      <div className="form-edit">
        {props.editing === editkey ? (
          <button type="submit" onClick={e => handleUpdate(e)} className="gobutton">
            Update
          </button>
        ) : (
          <button type="button" onClick={props.create ? e => handleUpdate(e) : e => handleClick(e)} className="gobutton">
            {props.create ? "Create" : "Edit"}
          </button>
        )}
      </div>
    </form>
  )
}

export default UserCard
