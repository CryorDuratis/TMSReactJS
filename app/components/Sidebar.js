// import node modules
import React from "react"
import { Link } from "react-router-dom"

// import components
import Container from "./Container"

function Sidebar() {
  return (
    <Container class="sidebar-container bgclr-light2">
      <h1>Dashboard</h1>
      <nav>
        <Link to={"/"}>App List</Link>
        <Link to={"/"}>App List</Link>
      </nav>
      <div className="protected-links">
        <Link to={"/usermgmt"}>User Management</Link>
      </div>
    </Container>
  )
}

export default Sidebar
