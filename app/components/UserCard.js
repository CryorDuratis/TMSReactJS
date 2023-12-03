import React from "react"
import Container from "./Container"

function UserCard(props) {
  return (
    <div key={props.user.username} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", display: "flex" }}>
      {props.children}
    </div>
  )
}

export default UserCard
