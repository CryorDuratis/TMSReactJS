// import node modules
import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Axios from "axios"

// import components
import Container from "../templates/Container"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function AppList() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  // managing rendering
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  // check user group
  // managing editing
  const [updateFlag, setUpdateFlag] = useState(false)
  // managing creating

  // display app information on first load, and on exit create.edit view
  // useEffect(() => {
  //   const fetchApps = async () => {
  //     try {
  //       // Make authorization request to the server
  //       const token = Cookies.get("token")
  //       var response = await Axios.post("/apps/getall", { groupname: "admin", token })

  //       // if not logged in
  //       if (response.data.unauth) {
  //         if (response.data.unauth === "login") {
  //           appDispatch({
  //             type: "logout",
  //             message: "Logged out",
  //           })
  //           navigate("/login")
  //         } else if (response.data.unauth === "role") {
  //           appDispatch({ type: "btoast", message: "Unauthorized page, redirecting to home" })
  //           navigate("/")
  //         }
  //         return
  //       }
  //     } catch (error) {}
  //   }
  // }, [updateFlag])

  return (
    <Container class="bgclr-light1 content-container">
      <div className="flex-row" style={{ justifyContent: "space-between", whiteSpace: "nowrap" }}>
        <h2>App List</h2>

        <button type="button" className="gobutton">
          Create App
        </button>
      </div>

      <Container class="list-container">
        <div className="app-grid-header">
          <strong>App Acronym</strong>
          <strong>App Start Date</strong>
          <strong>App End Date</strong>
        </div>
        <div className="list-card-container">
          <div className="app-card">
            <span className="form-acronym">hi</span>
            <span className="form-startdate">hi</span>
            <span className="form-enddate">hi</span>
            <div className="form-details">
              <button>Details</button>
            </div>
            <div className="form-edit">
              <button>Edit</button>
            </div>
          </div>
        </div>
      </Container>
    </Container>
  )
}

export default AppList
