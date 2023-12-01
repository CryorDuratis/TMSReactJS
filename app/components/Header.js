import React, { useContext } from "react"
import { Link } from "react-router-dom"
import Container from "./Container"
import HeaderLoggedIn from "./HeaderLoggedIn"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function Header() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  return (
    <Container class={"header-bar bgclr-accent colr-dark"} height={"60px"}>
      <Link to="/" className="logo">
        KANBAN
      </Link>
      {appState.loggedIn && <HeaderLoggedIn />}
    </Container>
  )
}

export default Header
