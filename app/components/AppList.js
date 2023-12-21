// import node modules
import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Axios from "axios"

// import components
import Container from "../templates/Container"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import Cookies from "js-cookie"
import CreateApp from "./CreateApp"
import EditApp from "./EditApp"

function AppList() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  // managing rendering
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [ModalMode, setModalMode] = useState("")
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
        var response = await Axios.post("/app/getall", { token })

        // if not logged in
        if (response.data.unauth) {
          console.log("user is unauth")
          appDispatch({
            type: "logout",
            message: "Logged out"
          })
          navigate("/login")
          return
        }
        // set apps
        setAppList(response.data.appsData)
        console.log("apps obtained: ", response.data.appsData)

        // check button authorization
        response = await Axios.post("/checkgroup", { groupname: "Project Lead", token })
        console.log("create app permit: ", !response.data.unauth)

        if (response.data.unauth) {
          setCAButton(false)
        } else {
          setCAButton(true)
        }
      } catch (error) {
        console.log("error: ", error)
      }
    }
    fetchApps()
  }, [updateFlag])

  // control create app and edit app popup modal
  const createModal = () => {
    setModalMode("create")
    setIsModalOpen(true)
  }
  const editModal = (e, App_Acronym) => {
    e.stopPropagation()
    setModalMode(App_Acronym)
    setIsModalOpen(true)
  }
  const handleCloseModal = () => {
    // close Modal
    setIsModalOpen(false)
  }

  // handle navigate
  const handleNavigate = appacro => {
    navigate(`/apps/${appacro}`)
  }

  // app card component for easy rendering
  const AppCard = props => {
    const { App_Acronym, App_Rnumber, App_startDate, App_endDate } = props.app
    return (
      <div className="app-card" onClick={e => handleNavigate(App_Acronym)}>
        <span className="form-acronym" title={App_Acronym}>
          {App_Acronym}
        </span>
        <span className="form-rnumber" title={App_Rnumber}>
          {App_Rnumber}
        </span>
        {App_startDate ? <input type="date" className="form-startdate" value={App_startDate} disabled /> : <span className="form-startdate">No date set</span>}
        {App_endDate ? <input type="date" className="form-enddate" value={App_endDate} disabled /> : <span className="form-enddate">No date set</span>}
        <button className="form-details gobutton" onClick={e => editModal(e, App_Acronym)}>
          Details
        </button>
      </div>
    )
  }

  // updates applist when new app is made or edited
  const updateAppList = () => {
    console.log("update app list called")
    setUpdateFlag(prev => !prev)
  }

  return (
    <Container class="bgclr-light1 content-container">
      <div className="breadcrumb">Apps</div>
      {isModalOpen && (ModalMode === "create" ? <CreateApp onClose={handleCloseModal} update={updateAppList} /> : <EditApp onClose={handleCloseModal} update={updateAppList} appacro={ModalMode} />)}
      <div className="flex-row" style={{ justifyContent: "space-between", whiteSpace: "nowrap" }}>
        <h2>App List</h2>
        {CAButton && (
          <button type="button" className="gobutton" onClick={createModal}>
            Create App
          </button>
        )}
      </div>
      <Container class="list-container">
        <div className="app-grid-header">
          <strong>App Acronym</strong>
          <strong>App Rnumber</strong>
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
