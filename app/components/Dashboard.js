// import node modules
import React, { useEffect } from "react"

// import components
import Page from "./Page"
import Sidebar from "./Sidebar"

const generateuniqueKey = () => {
  return new Date().getTime().toString()
}

function Dashboard(props) {
  var uniqueKey = ""
  useEffect(() => {
    uniqueKey = generateuniqueKey()
  }, [])

  return (
    <Page>
      <Sidebar key={uniqueKey} />
      {props.children}
    </Page>
  )
}

export default Dashboard
