// import node modules
import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Axios from "axios"

// import components
import Container from "./Container"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import UserCard from "./UserCard"

function UserList() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  const [userList, setUserList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const protectedLink = (pathname) => {
    appDispatch({ type: "update" })
    navigate(pathname)
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Make authorization request to the server
        var response = await Axios.post("/checkgroup", { userid: appState.user, groupname: "admin" })

        // If unauthorized

        // Make fetch request to the server
        response = await Axios.post("/user/getall")

        // Set the state based on the server response
        setUserList(response.data.usersData)
        setIsLoading(false)

        console.log("users obtained ", response.data.usersData)
      } catch (error) {
        console.error("Error fetching data:", error)
        // Handle errors as needed
      }
    }

    // Call the fetch function when the component mounts
    fetchUsers()
  }, [])

  return (
    <Container class="bgclr-light1 content-container">
      <h2>User List</h2>
      <Container class="content-wrapper">
        <div className="grid-header">
          <strong>Username</strong>
          <strong>Password</strong>
          <strong>Email</strong>
          <strong>User Groups</strong>
          <strong>Status</strong>
        </div>
        {isLoading ? "loading" : userList.map((user) => <UserCard user={user} map={user.username} />)}
      </Container>
      <UserCard user={{ username: "", email: "", role: "", isactive: 1 }} create={true} />
    </Container>
  )
}

export default UserList
