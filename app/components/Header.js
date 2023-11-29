import React from "react"
import { Link } from "react-router-dom"
import Container from "./Container"
import HeaderLoggedIn from "./HeaderLoggedIn"

function Header() {
  return (
    <Container class={"header-bar padding-sm header-bar-colour colr-dark"} height={"80px"}>
      <Link to="/" className="logo">
        {/* <img src="logo.png" /> */}
        KANBAN
      </Link>
      <HeaderLoggedIn />
    </Container>
  )
}

export default Header
