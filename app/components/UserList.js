// import node modules
import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Axios from "axios"

// import components
import Container from "../templates/Container"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import UserCard from "./UserCard"
import Cookies from "js-cookie"

function UserList() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  // managing rendering
  const [isLoading, setIsLoading] = useState(true)
  const [updateFlag, setUpdateFlag] = useState(false)
  const [editing, setEditing] = useState(0)
  const [error, setError] = useState("")
  // initial data
  const [userList, setUserList] = useState([])
  const [grouplist, setgrouplist] = useState([])
  // formdata states
  const [group, setGroup] = useState("")

  // updates list when new user is created
  const updateUserList = () => {
    console.log("update user list called")
    setUpdateFlag(prev => !prev)
    navigate("/usermgmt")
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

  // create group form submitted
  const createGroup = async e => {
    e.preventDefault()
    try {
      // send request -- create group
      const token = Cookies.get("token")
      const response = await Axios.post("/group/create", { groupname: "admin", token, group })

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

      // if request fails
      if (response.data.error) {
        appDispatch({ type: "logerror", error: response.data.error })
        return
      }
      // if create fails
      if (!response.data.success) {
        setError("conflict")
        appDispatch({
          type: "btoast",
          message: "Group name already exists"
        })
        return
      }
      setgrouplist(prev => [...prev, group])
      setGroup("")
      appDispatch({
        type: "gtoast",
        message: "Group successfully created"
      })
    } catch (error) {
      console.log("error is ", error)
    }
  }

  // get list of groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        // Make fetch request to the server
        const token = Cookies.get("token")
        const response = await Axios.post("/group/getall", { groupname: "admin", token })
        // console.log("response ", response.data)

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

        // Set the grouplist based on the server response
        setgrouplist(response.data.groupsData.map(obj => obj.groupname))

        // console.log("groups obtained ", grouplist)
      } catch (error) {
        console.error("Error fetching data:", error)
        // Handle errors as needed
      }
    }

    // Call the fetch function when the component mounts
    fetchGroups()
  }, [])

  return (
    <Container class="bgclr-light1 content-container">
      <div className="flex-row" style={{ justifyContent: "space-between", whiteSpace: "nowrap" }}>
        <h2>User List</h2>
        <form className="flex-row" onSubmit={e => createGroup(e)}>
          <label htmlFor="group">Create User Group: </label>
          <input className={error === "conflict" ? "error-outline" : undefined} type="text" name="group" value={group} onChange={e => setGroup(e.target.value)} />
          <button type="button" onClick={e => createGroup(e)} className="gobutton">
            Create Group
          </button>
        </form>
      </div>
      <Container class="create-form-container">
        <div className="user-grid-header">
          <strong>Username</strong>
          <strong>Password</strong>
          <strong>Email</strong>
          <strong>User Groups</strong>
          <strong>Status</strong>
        </div>
        <div className="list-card-container">
          <UserCard user={{ username: "", email: "", role: "", isactive: 1 }} create={true} update={updateUserList} userlist={userList} grouplist={grouplist} />
        </div>
      </Container>
      <Container class="list-container">
        {isLoading
          ? "loading"
          : userList.map((user, index) => (
              <div key={index} className="list-card-container">
                <UserCard user={user} userlist={userList} listkey={index} update={updateUserList} editing={editing} setEditing={setEditing} grouplist={grouplist} />
              </div>
            ))}
      </Container>
    </Container>
  )
}

export default UserList
