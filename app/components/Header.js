import React from "react"
import { Link } from "react-router-dom"
import Container from "./Container"
import HeaderLoggedIn from "./HeaderLoggedIn"

function Header() {
  return (
    <Container class={"header-bar padding-sm bgclr-accent colr-dark"} height={"60px"}>
      <Link to="/" className="logo">
        {/* <img src="logo.png" /> */}
        KANBAN
      </Link>
      <HeaderLoggedIn />
    </Container>
  )
}

export default Header
