// import node modules
import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Axios from "axios"

// import components
import Container from "./Container"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function Sidebar() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  const protectedLink = (pathname) => {
    appDispatch({ type: "update" })
    navigate(pathname)
  }

  const [UMButton, setUMButton] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a request to the server
        const response = await Axios.post("/checkgroup", { userid: appState.user, groupname: "admin" })

        // Set the state based on the server response
        setUMButton(response.data.authorized)
        console.log(UMButton)
      } catch (error) {
        console.error("Error fetching data:", error)
        // Handle errors as needed
      }
    }

    // Call the fetchData function when the component mounts
    fetchData()
  }, [])

  return (
    <Container class="sidebar bgclr-light2">
      <div className="sidebar-container">
        <nav>
          <h2>Dashboard</h2>
          {UMButton && <span onClick={() => protectedLink("/usermgmt")}>User Management</span>}
        </nav>
      </div>
    </Container>
  )
}

export default Sidebar
