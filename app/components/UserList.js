// import node modules
import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Axios from "axios"

// import components
import Container from "./Container"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import UserCard from "./UserCard"
import Cookies from "js-cookie"

function UserList() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  const [userList, setUserList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [updateFlag, setUpdateFlag] = useState(false)
  const [editing, setEditing] = useState(0)

  // updates list when new user is created
  const updateUserList = () => {
    console.log("update user list called")
    setUpdateFlag(prev => !prev)
  }

  // display user information on load, and on update
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Make authorization request to the server
        const token = Cookies.get("token")
        var response = await Axios.post("/user/getall", { groupname: "admin", token })

        // if not logged in
        if (response.data.unauth) {
          if (response.data.unauth === "login") {
            appDispatch({
              type: "logout",
              message: "Logged out"
            })
            navigate("/login")
          } else if (response.data.unauth === "role") {
            appDispatch({ type: "btoast", message: "Unauthorized page, redirecting to home" })
            navigate("/")
          }
          return
        }

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
  }, [updateFlag])

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
        {isLoading ? "loading" : userList.map((user, index) => <UserCard user={user} listkey={index} update={updateUserList} class="edit-form-container" editing={editing} setEditing={setEditing} />)}
      </Container>
      <Container class="create-form-container">
        <div className="grid-header">
          <strong>Username</strong>
          <strong>Password</strong>
          <strong>Email</strong>
          <strong>User Groups</strong>
          <strong>Status</strong>
        </div>
        <UserCard user={{ username: "", email: "", role: "", isactive: 1 }} create={true} update={updateUserList} class="edit-form-container" />
      </Container>
    </Container>
  )
}

export default UserList
