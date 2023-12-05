import React, { useContext, useEffect } from "react"
import Container from "./Container"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import Axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"
import Cookies from "js-cookie"

function HeaderLoggedIn(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  const logout = async () => {
    try {
      // send request -- logout
      const response = await Axios.post("/logout")

      // if request fails
      if (response.data.error) {
        appDispatch({
          type: "toast",
          message: "An error was encountered",
        })
        return
      }
      // else on success
      Cookies.remove("token")
      Cookies.remove("kanbanuser")
      console.log("logout is called")

      appDispatch({
        type: "logout",
        message: "Logged out",
      })
      navigate("/login")
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Container class={"header-grp"}>
      <button className="header-btn">
        <img src="profile.png" className="avatar" />
        {appState.user} &#9660;
      </button>
      <button className="header-btn" onClick={logout}>
        <img src="logout.png" className="icon" />
        Log out
      </button>
    </Container>
  )
}

export default HeaderLoggedIn
