// import node modules
import React, { useContext, useEffect } from "react"

// import components
import Sidebar from "../components/Sidebar"
import Page from "../templates/Page"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function Home(props) {
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

export default Home
