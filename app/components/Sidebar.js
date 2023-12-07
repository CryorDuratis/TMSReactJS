// import node modules
import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Axios from "axios"

// import components
import Container from "../templates/Container"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import Cookies from "js-cookie"

function Sidebar() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  const [UMButton, setUMButton] = useState(false)

  // check authorization on mount component
  useEffect(() => {
    const fetchUMButton = async () => {
      try {
        // check permissions: in this case only admin
        // Make authorization request to the server
        const token = Cookies.get("token")
        const response = await Axios.post("/checkgroup", { groupname: "admin", token })

        // if not logged in
        if (response.data.unauth) {
          if (response.data.unauth === "login") {
            appDispatch({
              type: "logout",
              message: "Logged out",
            })
            navigate("/login")
          }
          setUMButton(false)
          return
        }
        // Set the state based on the server response
        else setUMButton(true)
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
          {UMButton && <span onClick={() => navigate("/usermgmt")}>Users Management</span>}
        </nav>
      </div>
    </Container>
  )
}

export default Sidebar
