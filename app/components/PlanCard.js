// import node modules
import React, { useContext, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Axios from "axios"
import { ChromePicker } from "react-color"

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
    // edit card
    defaultplan = props.planlist[props.listkey]
  } else defaultplan = props.plan // create card

  // formdata handles optional fields that are retrieved from db
  const [formData, setFormData] = useState(defaultplan)

  // managing rendering
  const [error, setError] = useState("")
  const editkey = props.listkey + 1 // so that 0 can be set as nothing is editing

  // generate random colour
  function generateRandomColor() {
    const letters = "0123456789ABCDEF"
    let randomColor = "#"
    for (let i = 0; i < 6; i++) {
      randomColor += letters[Math.floor(Math.random() * 16)]
    }
    return randomColor
  }

  // set default formdata and close popup if not editing current user
  useEffect(() => {
    console.log("editing changed ", props.editing)
    if (!props.create) {
      if (props.editing !== editkey) {
        defaultplan = props.planlist[props.listkey]
        setFormData(defaultplan)
      }
      // close popup
    } else if (!formData.Plan_colour) {
      setFormData(prev => ({
        ...prev,
        ["Plan_colour"]: generateRandomColor()
      }))
    }
  }, [props.editing, props.planlist])

  // change text colour to white if the background is dark
  // const isColorDark = hexColor => {
  //   const r = parseInt(hexColor.slice(1, 3), 16)
  //   const g = parseInt(hexColor.slice(3, 5), 16)
  //   const b = parseInt(hexColor.slice(5, 7), 16)
  //   const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  //   return luminance < 0.5 // Adjust the threshold as needed
  // }
  // const textColor = formData.Plan_colour ? (isColorDark(formData.Plan_colour) ? "white" : "black") : "black"

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
        const { Plan_MVP_name, Plan_startDate, Plan_endDate, Plan_colour } = formData

        const token = Cookies.get("token")

        // send request -- edit
        const requestbody = { groupname: "Project Manager", Plan_MVP_name, Plan_startDate, Plan_endDate, Plan_colour, Plan_app_Acronym: appid, token }
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
          appDispatch({ type: "btoast", message: response.data.error })
          props.update()
          return
        }
        // else on success
        setError(false)
        appDispatch({
          type: "gtoast",
          message: "Plan edited successfully"
        })

        // update formdata
        setFormData(prev => ({
          ...prev,
          ["Plan_startDate"]: Plan_startDate,
          ["Plan_endDate"]: Plan_endDate
        }))
      } catch (e) {
        console.log(e)
      }
    }
    // submit create
    if (props.create) {
      console.log("create form was submitted")
      try {
        const { Plan_MVP_name, Plan_startDate, Plan_endDate, Plan_colour } = formData

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
        const response = await Axios.post("/plan/create", { groupname: "Project Manager", Plan_MVP_name, Plan_startDate, Plan_endDate, Plan_colour, Plan_app_Acronym: appid, token })

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
          appDispatch({ type: "error", error: response.data.error })
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
    } else {
      setFormData(prev => ({
        ...prev,
        ["Plan_colour"]: generateRandomColor()
      }))
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
  const handleColourChange = e => {
    setFormData(prevData => ({
      ...prevData,
      ["Plan_colour"]: e.hex
    }))
  }

  return (
    <form className="plan-form">
      <input type="text" name="Plan_MVP_name" value={formData.Plan_MVP_name} disabled={!props.create} onChange={e => handleInputChange(e)} title={formData.Plan_MVP_name} className={error ? "error-outline" : undefined} maxLength={255} />

      {formData.Plan_startDate || props.editing === editkey || props.create ? <input type="date" name="Plan_startDate" value={formData.Plan_startDate} disabled={props.editing !== editkey && !props.create} onChange={e => handleInputChange(e)} /> : <span>No Date Set</span>}

      {formData.Plan_endDate || props.editing === editkey || props.create ? <input type="date" name="Plan_endDate" value={formData.Plan_endDate} disabled={props.editing !== editkey && !props.create} onChange={e => handleInputChange(e)} /> : <span>No Date Set</span>}

      <div className={props.editing !== editkey && !props.create ? "chromepicker-container" : "chromepicker-container active"}>
        <div style={{ padding: "5px", backgroundColor: formData.Plan_colour, color: "transparent" }}>{formData.Plan_colour}</div>
        <ChromePicker className="chromepicker-popup" color={formData.Plan_colour} disabled={props.editing !== editkey && !props.create} onChange={e => handleColourChange(e)} />
      </div>

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
