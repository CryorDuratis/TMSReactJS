// import node modules
import React, { useContext, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Axios from "axios"

// import components
import Container from "../templates/Container"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import Popup from "./Popup"
import Cookies from "js-cookie"

function PlanCard(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()
  const { appid } = useParams()

  // state of fields
  var defaultplan = {}
  if (props.listkey) {
    defaultplan = props.planlist[props.listkey]
  } else defaultplan = props.plan

  // formdata handles optional fields that are retrieved from db
  const [formData, setFormData] = useState(defaultplan)
  // role is optional field, with default field if empty

  // managing rendering
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [error, setError] = useState("")
  const editkey = props.listkey + 1 // so that 0 can be set as nothing is editing

  // set default formdata and close popup if not editing current user
  useEffect(() => {
    console.log("editing changed ", props.editing)
    if (!props.create) {
      if (props.editing !== editkey) {
        setIsPopupOpen(false)
        setFormData(defaultplan)
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

    // submit edit
    if (props.editing === editkey) {
      props.setEditing(0)
      console.log("edit form was submitted")
      try {
        const { Plan_MVP_name, Plan_startDate, Plan_endDate } = formData

        const token = Cookies.get("token")

        // send request -- edit
        const requestbody = { groupname: "Project Manager", Plan_MVP_name, Plan_startDate, Plan_endDate, Plan_app_Acronym: appid, token }
        const response = await Axios.post("/plan/edit", requestbody)

        // if not logged in
        if (response.data.unauth) {
          if (response.data.unauth === "login") {
            appDispatch({
              type: "logout",
              message: "Logged out"
            })
            navigate("/login")
          } else if (response.data.unauth === "role") {
            appDispatch({ type: "btoast", message: "Unauthorized page, redirecting back to apps" })
            navigate(pathname.split("/plans")[0])
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
        // else on success
        setError(false)
        appDispatch({
          type: "gtoast",
          message: "Plan edited successfully"
        })
      } catch (e) {
        console.log(e)
      }
    }
    // submit create
    if (props.create) {
      console.log("create form was submitted")
      try {
        const { Plan_MVP_name, Plan_startDate, Plan_endDate } = formData

        const token = Cookies.get("token")
        // if required fields blank
        if (!Plan_MVP_name) {
          setError("required")
          appDispatch({
            type: "btoast",
            message: "Plan name is required"
          })
          props.update()
          return
        }

        // send request -- create
        const response = await Axios.post("/plan/create", { groupname: "Project Manager", Plan_MVP_name, Plan_startDate, Plan_endDate, Plan_app_Acronym: appid, token })

        // if not logged in
        if (response.data.unauth) {
          if (response.data.unauth === "login") {
            appDispatch({
              type: "logout",
              message: "Logged out"
            })
            navigate("/login")
          } else if (response.data.unauth === "role") {
            appDispatch({ type: "btoast", message: "Unauthorized page, redirecting back to apps" })
            navigate(pathname.split("/plans")[0])
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
            message: "Plan name already used in this app"
          })
          props.update()
          return
        }
        // else on success
        setError(false)
        appDispatch({
          type: "gtoast",
          message: "New plan created successfully"
        })
      } catch (e) {
        console.log(e)
      }
    }
    props.update()
  }

  // set default form data if canceled or cleared
  const handleCancel = e => {
    setFormData(defaultplan)
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

  // pass to each user form to handle roles in a multiselect dropdown
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen)
  }
  const handleClosePopup = () => {
    // close popup
    setIsPopupOpen(false)
  }

  return (
    <form className="plan-form">
      <input type="text" name="Plan_MVP_name" value={formData.Plan_MVP_name} disabled={!props.create} onChange={e => handleInputChange(e)} title={formData.Plan_MVP_name} className={error ? "error-outline" : undefined} />

      {formData.Plan_startDate || props.editing || props.create ? <input type="date" name="Plan_startDate" value={formData.Plan_startDate} disabled={props.editing !== editkey && !props.create} onChange={e => handleInputChange(e)} /> : <span>No Date Set</span>}

      {formData.Plan_endDate || props.editing || props.create ? <input type="date" name="Plan_endDate" value={formData.Plan_endDate} disabled={props.editing !== editkey && !props.create} onChange={e => handleInputChange(e)} /> : <span>No Date Set</span>}

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

export default PlanCard
