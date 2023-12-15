// import node modules
import React, { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

// import components
import Sidebar from "../components/Sidebar"
import Page from "../templates/Page"
import PlanList from "./PlanList"

function PlanMgmt(props) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // check authentication and authorization on remount
  useEffect(() => {
    props.onLoad()
    const checkauth = async () => {
      try {
        const token = Cookies.get("token")
        // check button authorization
        var response = await Axios.post("/checkgroup", { groupname: "Project Manager", token })
        console.log("checkgroup", response)

        if (response.data.unauth) {
          appDispatch({
            type: "btoast",
            message: "Unauthorised page, redirecting back to app"
          })
          navigate(pathname.split("/plan")[0])
        }
      } catch (error) {
        console.log("error ", error)
      }
    }
    checkauth()
  }, [])

  return (
    <Page>
      <Sidebar />
      <PlanList />
    </Page>
  )
}

export default PlanMgmt
