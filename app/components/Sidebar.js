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
  // const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  return (
    <Container class="sidebar bgclr-light2">
      <div className="sidebar-container">
        <nav>
          <h2>Dashboard</h2>
          {appState.admin && <span onClick={() => navigate("/usermgmt")}>Users Management</span>}
        </nav>
      </div>
    </Container>
  )
}

export default Sidebar
