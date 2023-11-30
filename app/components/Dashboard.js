// import node modules
import React from "react"

// import components
import Page from "./Page"
import Sidebar from "./Sidebar"

function Dashboard(props) {
  return (
    <Page>
      <Sidebar />
      {props.children}
    </Page>
  )
}

export default Dashboard
