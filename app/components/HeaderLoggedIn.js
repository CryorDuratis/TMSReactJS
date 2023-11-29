import React from "react"
import Container from "./Container"

function HeaderLoggedIn(props) {
  return (
    <Container class={"header-bar"}>
      <button className="transp-btn">
        <img src="profile.png" className="avatar" />
        Username &#9660;
      </button>
      <button className="transp-btn">
        <img src="logout.png" className="icon" />
        Log out
      </button>
    </Container>
  )
}

export default HeaderLoggedIn
