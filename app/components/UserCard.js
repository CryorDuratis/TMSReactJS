// import node modules
import React, { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Axios from "axios"

// import components
import Container from "./Container"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import Popup from "./Popup"

function UserCard(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  // state of fields
  const [formData, setFormData] = useState(props.user)
  const [selectedRoles, setSelectedRoles] = useState(formData.role)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [error, setError] = useState("")
  const editkey = props.listkey + 1
  const buttonRef = useRef(null)

  // set default formdata and close popup if not editing current user
  useEffect(() => {
    if (!props.create) {
      if (props.editing !== editkey) {
        setIsPopupOpen(false)
        setFormData(props.user)
      }
      // close popup
    }
  }, [props.editing])

  // set editing to this item
  const handleClick = async e => {
    e.preventDefault()
    props.setEditing(editkey)
  }

  // submit to backend
  const handleUpdate = async e => {
    e.preventDefault()
    props.setEditing(0)

    // check if authorized

    // submit values
    if (props.editing === editkey) {
      console.log("edit form was submitted")
    }
    // if create
    if (props.create) {
      try {
        const { username, password, email, role } = formData
        // if required fields blank
        if (!username || !password) {
          setError("required")
          return
        }
        // send request -- create
        const response = await Axios.post("/user/create", { username, password, email, role })

        // if request fails
        if (response.data.error) {
          appDispatch({ type: "logerror", error: response.data.error })
          return
        }
        // if create fails
        if (!response.data.success) {
          setError(response.data.message)
          return
        }
        // else on success
        setError(false)
      } catch (e) {
        console.log(e)
      }
      props.update()
      console.log("create form was submitted")
    }
  }

  // set default form data if canceled or cleared
  const handleCancel = e => {
    setFormData(props.user)
    props.setEditing(0)
  }

  // updates form values for axios submission since single page react cant use default form actions
  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  //
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen)
  }
  const handleClosePopup = () => {
    setIsPopupOpen(false)
  }

  console.log("key is: ", props.listkey, " and user is ", props.user.username)
  return (
    <Container listkey={props.listkey} class={props.class}>
      <form className="user-form">
        <input type="text" name="username" value={formData.username} disabled={!props.create} onChange={e => handleInputChange(e)} className="form-username" />

        <input type="password" name="password" placeholder="********" disabled={props.editing !== editkey && !props.create} onChange={e => handleInputChange(e)} className="form-password" />

        <input type="email" name="email" value={formData.email} disabled={props.editing !== editkey && !props.create} onChange={e => handleInputChange(e)} className="form-email" />

        <div className="form-role">
          <button type="button" name="role" value={formData.role ? formData.role : "user"} disabled={props.editing !== editkey && !props.create} onClick={e => togglePopup(e)}>
            {selectedRoles ? selectedRoles : "user"} {props.editing === editkey || props.create ? <>&#9660;</> : ""}
          </button>
          <Popup isOpen={isPopupOpen} onClose={handleClosePopup} buttonRef={buttonRef} />
        </div>

        <select className="form-status" name="isactive" value={formData.isactive.toString() === "1" ? "1" : "0"} disabled={props.editing !== editkey} onChange={e => handleInputChange(e)}>
          <option value="1">Active</option>
          <option value="0">Disabled</option>
        </select>

        <div className="form-cancel">
          {props.editing === editkey ? (
            <button type="button" onClick={e => handleCancel(e)}>
              Cancel
            </button>
          ) : (
            props.create && (
              <button type="button" onClick={e => handleCancel(e)}>
                Clear
              </button>
            )
          )}
        </div>

        <div className="form-edit">
          {props.editing === editkey ? (
            <button type="submit" onClick={e => handleUpdate(e)}>
              Update
            </button>
          ) : (
            <button type="button" onClick={props.create ? e => handleUpdate(e) : e => handleClick(e)}>
              {props.create ? "Create" : "Edit"}
            </button>
          )}
        </div>
      </form>
    </Container>
  )
}

export default UserCard
