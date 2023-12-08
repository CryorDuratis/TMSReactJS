// import node modules
import React, { useEffect } from "react"

// import components
import Sidebar from "../components/Sidebar"
import Page from "../templates/Page"

function AppMgmt(props) {
  // check authentication and authorization on remount
  useEffect(() => {
    props.onLoad()
  }, [])

  return (
    <Page>
      <Sidebar />
      {/* AppList */}
    </Page>
  )
}

export default AppMgmt
