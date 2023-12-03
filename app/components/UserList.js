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
        <div className="grid-header">username email usergroups status</div>
        {isLoading
          ? "loading"
          : userList.map((user) => (
              <UserCard user>
                <form className="user-form">
                  <input type="text" placeholder={user.username} readOnly onChange={(e) => setUsername(e.target.value)} className="form-username" />
                  <input type="password" placeholder="********" readOnly onChange={(e) => setUsername(e.target.value)} className="form-password" />
                  <input type="email" placeholder={user.email} readOnly onChange={(e) => setUsername(e.target.value)} className="form-email" />
                  <select className="form-role">
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                  <input type="text" placeholder={user.isactive ? "Active" : "Disabled"} readOnly className="form-status" />
                  <div className="form-edit">
                    <button type="button">Edit</button>
                  </div>
                </form>
              </UserCard>
            ))}
      </Container>
    </Container>
  )
}

export default UserList
