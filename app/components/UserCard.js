// import node modules
import React, { useContext, useEffect, useState } from "react"

// import components
import Container from "./Container"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { useNavigate } from "react-router-dom"

function UserCard(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  // state of fields
  const [formData, setFormData] = useState(props.user)
  const [editing, setEditing] = useState(props.create)
  // const initrole = props.user.role.split(",")

  const handleClick = (e) => {
    e.preventDefault()
    // if edit
    setEditing(true)
    // if create
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setEditing(false)

    // check if authorized

    // submit values

    console.log("edit form was submitted")
  }

  const handleCancel = (e) => {
    setFormData(props.user)
    setEditing(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  return (
    <div key={props.map} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", display: "flex" }}>
      <form className="user-form">
        <input type="text" name="username" placeholder={props.user.username} disabled={!editing} onChange={(e) => handleInputChange(e)} className="form-username" />

        <input type="password" name="password" placeholder="********" disabled={!editing} onChange={(e) => handleInputChange(e)} className="form-password" />

        <input type="email" name="email" placeholder={props.user.email} disabled={!editing} onChange={(e) => handleInputChange(e)} className="form-email" />

        <select className="form-role" name="role" value={props.user.role === "admin" ? "admin" : "user"} disabled={!editing} onChange={(e) => handleInputChange(e)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {/* <div className="form-role">
          {initrole.map((role) => (
            <button type="button">{role} &times;</button>
          ))}
          <button type="button">Add Group +</button>
        </div> */}

        <select className="form-status" name="isactive" value={props.user.isactive ? "1" : "0"} disabled={!editing} onChange={(e) => setIsactive(e.target.value)}>
          <option value="1">Active</option>
          <option value="0">Disabled</option>
        </select>

        {/* <input type="checkbox" name="Active" checked={props.user.isactive} disabled className="form-status" onChange={(e) => setIsactive(e.target.checked)} /> */}

        <div className="form-cancel">
          {editing && !props.create && (
            <button type="reset" onClick={(e) => handleCancel(e)}>
              Cancel
            </button>
          )}
        </div>

        <div className="form-edit">
          {editing && !props.create ? (
            <button type="submit" onClick={(e) => handleUpdate(e)}>
              Update
            </button>
          ) : (
            <button type="button" onClick={(e) => handleClick(e)}>
              {props.create ? "Create" : "Edit"}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default UserCard
