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
  }, [])

  return (
    <Page>
      <Sidebar />
      <PlanList />
    </Page>
  )
}

export default PlanMgmt
