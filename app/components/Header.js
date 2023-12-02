import React, { useContext } from "react"
import { useNavigate } from "react-router-dom"
import Container from "./Container"
import HeaderLoggedIn from "./HeaderLoggedIn"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function Header() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  const protectedLink = (pathname) => {
    appDispatch({ type: "update" })
    navigate(pathname)
  }

  return (
    <Container class={"header-bar bgclr-accent colr-dark"} height={"60px"}>
      <div className="header-container">
        <span onClick={() => protectedLink("/")} className="logo">
          KANBAN
        </span>
        {appState.user && <HeaderLoggedIn />}
      </div>
    </Container>
  )
}

export default Header
