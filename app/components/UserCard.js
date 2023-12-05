// import node modules
import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Axios from "axios"

// import components
import Container from "./Container"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function UserCard(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  // state of fields
  const [formData, setFormData] = useState(props.user)
  const [error, setError] = useState("")
  const editkey = props.listkey + 1

  // set default formdata if not editing current user
  useEffect(() => {
    if (!props.create) {
      if (props.editing !== editkey) setFormData(props.user)
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

  //
  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleRole = () => {}

  console.log("key is: ", props.listkey, " and user is ", props.user.username)
  return (
    <Container listkey={props.listkey} class={props.class}>
      <form className="user-form">
        <input type="text" name="username" value={formData.username} disabled={!props.create} onChange={e => handleInputChange(e)} className="form-username" />

        <input type="password" name="password" placeholder="********" disabled={props.editing !== editkey && !props.create} onChange={e => handleInputChange(e)} className="form-password" />

        <input type="email" name="email" value={formData.email} disabled={props.editing !== editkey && !props.create} onChange={e => handleInputChange(e)} className="form-email" />

        {/* <select className="form-role" name="role" value={formData.role === "admin" ? "admin" : "user"} disabled={editing !== editkey} onChange={e => handleInputChange(e)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select> */}

        <button type="button" name="role" value={formData.role ? formData.role : "user"} disabled={props.editing !== editkey && !props.create} className="form-role">
          {formData.role ? formData.role : "user"}
          <img src="edit.png" className={props.editing === editkey || props.create ? "icon" : "icon hidden"} />
        </button>

        <select className="form-status" name="isactive" value={formData.isactive.toString() === "1" ? "1" : "0"} disabled={props.editing !== editkey} onChange={e => handleInputChange(e)}>
          <option value="1">Active</option>
          <option value="0">Disabled</option>
        </select>

        {/* <input type="checkbox" name="Active" checked={props.user.isactive} disabled className="form-status" onChange={(e) => setIsactive(e.target.checked)} /> */}

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
