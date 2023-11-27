import React from "react"
import { Link } from "react-router-dom"
import Container from "./Container"
import HeaderLoggedIn from "./HeaderLoggedIn"

function Header() {
  return (
    <Container>
      <Link to="/">
        <img src="logo.webp" />
      </Link>
      <HeaderLoggedIn />
    </Container>
  )
}

export default Header
