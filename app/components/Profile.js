import React from "react"
import Container from "./Container"

function Profile() {
  return (
    <Container class="profile">
      <h1>Annie</h1>
      <form>
        <label htmlFor="email">
          Update Email:
          <input type="text" name="email" placeholder="email" />
        </label>
        <label htmlFor="password">
          Change Password:
          <input type="password" name="password" placeholder="password" />
        </label>
        <button type="button">Update</button>
      </form>
    </Container>
  )
}

export default Profile
