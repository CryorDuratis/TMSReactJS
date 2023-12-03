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

  const [UMButton, setUMButton] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // check authentication on navigation
  const protectedLink = (pathname) => {
    appDispatch({ type: "update" })
    navigate(pathname)
  }

  // check authorzation on mount component
  useEffect(() => {
    const fetchUMButton = async () => {
      try {
        // check permissions: in this case only admin

        // Make authorization request to the server
        const response = await Axios.post("/checkgroup", { userid: appState.user, groupname: "admin" })

        // Set the state based on the server response
        setUMButton(response.data.authorized)
        console.log("show umbutton ", UMButton)
      } catch (error) {
        console.error("Error fetching data:", error)
        // Handle errors as needed
      }
    }

    // Call the fetch function when the component mounts
    fetchUMButton()
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
