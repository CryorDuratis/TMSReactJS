import React from "react"
import { Link } from "react-router-dom"
import Container from "./Container"
import HeaderLoggedIn from "./HeaderLoggedIn"

function Header() {
  return (
    <Container class={"header-bar padding-sm header-bar-colour"} height={"3rem"} width={"100vw"}>
      <Link to="/" className="logo">
        {/* <img src="logo.png" /> */}
        KANBAN
      </Link>
      <HeaderLoggedIn />
    </Container>
  )
}

export default Header
