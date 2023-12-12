// import node modules
import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Axios from "axios"

// import components
import Container from "../templates/Container"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import Cookies from "js-cookie"
import AppInfo from "./AppInfo"

function AppList() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  // managing rendering
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [popupMode, setPopupMode] = useState("")
  const [error, setError] = useState("")
  const [CAButton, setCAButton] = useState(false)
  // initial data
  const [appList, setAppList] = useState([])
  // managing editing
  const [updateFlag, setUpdateFlag] = useState(false)
  // managing creating

  // display app information on first load, and on exit create.edit view
  useEffect(() => {
    const fetchApps = async () => {
      console.log("fetchapps is loaded")
      try {
        // Make authorization request to the server
        const token = Cookies.get("token")
        var response = await Axios.post("/app/getall", { groupname: "Project Lead", token })
        console.log("response: ", response)

        // if not logged in
        if (response.data.unauth) {
          console.log("user is unauth")
          if (response.data.unauth === "login") {
            appDispatch({
              type: "logout",
              message: "Logged out"
            })
            navigate("/login")
          }
          console.log("cabutton set to false")
          setCAButton(false)
          return
        } else {
          console.log("cabutton set to true")
          setCAButton(true)
        }
      } catch (error) {
        console.log("error: ", error)
      }
    }
    fetchApps()
  }, [updateFlag])

  // control create app and edit app popup modal
  const openPopup = () => {
    setIsPopupOpen(true)
  }
  const handleClosePopup = () => {
    // close popup
    setIsPopupOpen(false)
  }

  // app card component for easy rendering
  const AppCard = props => {
    const { appacro, startdate, enddate } = props.app
    return (
      <div className="app-card">
        <span className="form-acronym">{appacro}</span>
        <span className="form-startdate">{startdate}</span>
        <span className="form-enddate">{enddate}</span>
        <button className="form-details gobutton">View Details</button>
      </div>
    )
  }

  return (
    <Container class="bgclr-light1 content-container">
      {isPopupOpen && (popupMode === "create" ? <AppInfo onClose={handleClosePopup} /> : <AppInfo onClose={handleClosePopup} />)}
      <div className="flex-row" style={{ justifyContent: "space-between", whiteSpace: "nowrap" }}>
        <h2>App List</h2>
        {CAButton && (
          <button type="button" className="gobutton" onClick={openPopup}>
            Create App
          </button>
        )}
      </div>
      <Container class="list-container">
        <div className="app-grid-header">
          <strong>App Acronym</strong>
          <strong>App Start Date</strong>
          <strong>App End Date</strong>
        </div>
        {appList.length > 0 ? (
          appList.map((app, index) => (
            <div key={index} className="list-card-container">
              <AppCard app={app} />
            </div>
          ))
        ) : (
          <p>No apps found. Create an app to begin.</p>
        )}
      </Container>
    </Container>
  )
}

export default AppList
