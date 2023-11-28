import React from "react"
import Container from "./Container"

function HeaderLoggedIn(props) {
  return (
    <Container class={"header-bar"}>
      <button>
        <img src="profile.png" />
        <h1>username &#9660;</h1>
      </button>

      <button>
        <img src="logout.png" />
        <h3>log out</h3>
      </button>
    </Container>
  )
}

export default HeaderLoggedIn
