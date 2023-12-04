// import node modules
import React, { useContext, useEffect, useState } from "react"

// import components
import Container from "./Container"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { useNavigate } from "react-router-dom"
import Axios from "axios"

function UserCard(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  // state of fields
  const [formData, setFormData] = useState(props.user)
  const [editing, setEditing] = useState(props.create)
  const [error, setError] = useState("")
  // const initrole = props.user.role.split(",")

  const handleClick = async e => {
    e.preventDefault()
    // if edit
    setEditing(true)
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
      console.log("create form was submitted")
    }
  }

  const handleUpdate = async e => {
    e.preventDefault()
    setEditing(false)

    // check if authorized

    // submit values

    console.log("edit form was submitted")
  }

  const handleCancel = e => {
    setFormData(props.user)
    setEditing(false)
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  console.log("key is: ", props.listkey, " and user is ", props.user.username)
  return (
    <Container listkey={props.listkey} class={props.class}>
      <form className="user-form">
        <input type="text" name="username" placeholder={formData.username} disabled={!editing} onChange={e => handleInputChange(e)} className="form-username" />

        <input type="password" name="password" placeholder="********" disabled={!editing} onChange={e => handleInputChange(e)} className="form-password" />

        <input type="email" name="email" placeholder={formData.email} disabled={!editing} onChange={e => handleInputChange(e)} className="form-email" />

        <select className="form-role" name="role" value={formData.role === "admin" ? "admin" : "user"} disabled={!editing} onChange={e => handleInputChange(e)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {/* <div className="form-role">
          {initrole.map((role) => (
            <button type="button">{role} &times;</button>
          ))}
          <button type="button">Add Group +</button>
        </div> */}

        <select className="form-status" name="isactive" value={formData.isactive ? "1" : "0"} disabled={!editing} onChange={e => handleInputChange(e)}>
          <option value="1">Active</option>
          <option value="0">Disabled</option>
        </select>

        {/* <input type="checkbox" name="Active" checked={props.user.isactive} disabled className="form-status" onChange={(e) => setIsactive(e.target.checked)} /> */}

        <div className="form-cancel">
          {editing && !props.create && (
            <button type="reset" onClick={e => handleCancel(e)}>
              Cancel
            </button>
          )}
        </div>

        <div className="form-edit">
          {editing && !props.create ? (
            <button type="submit" onClick={e => handleUpdate(e)}>
              Update
            </button>
          ) : (
            <button type="button" onClick={e => handleClick(e)}>
              {props.create ? "Create" : "Edit"}
            </button>
          )}
        </div>
      </form>
    </Container>
  )
}

export default UserCard
