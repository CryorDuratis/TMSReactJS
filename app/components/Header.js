import React, { useContext } from "react"
import { Link } from "react-router-dom"
import Container from "./Container"
import HeaderLoggedIn from "./HeaderLoggedIn"
import StateContext from "../StateContext"

function Header() {
  const appState = useContext(StateContext)

  return (
    <Container class={"header-bar bgclr-accent colr-dark"} height={"60px"}>
      <Link to="/" className="logo">
        KANBAN
      </Link>
      {appState.user && <HeaderLoggedIn />}
    </Container>
  )
}

export default Header
