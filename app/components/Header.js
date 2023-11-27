import React from "react"
import { Link } from "react-router-dom"

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
