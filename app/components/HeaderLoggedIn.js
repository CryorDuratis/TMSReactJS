import React from "react"
import Container from "./Container"

function HeaderLoggedIn() {
  return (
    <Container>
      <div>
        {/* logged in ? button */}
        <button>
          <img src="profile.png" />
          <h1>username &#9660;</h1>
        </button>
        {/* profile drop down modal*/}
        {/* edit profile */}
        <div>
          <img src="edit.png" />
          <h3>edit profile</h3>
        </div>
        {/* logout */}
        <div>
          <img src="logout.png" />
          <h3>log out</h3>
        </div>
      </div>
    </Container>
  )
}

export default HeaderLoggedIn
