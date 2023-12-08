// import node modules
import React, { useEffect } from "react"

// import components

import Sidebar from "../components/Sidebar"
import Page from "../templates/Page"

const generateuniqueKey = () => {
  return new Date().getTime().toString()
}

function Home(props) {
  var uniqueKey = ""
  useEffect(() => {
    uniqueKey = generateuniqueKey()
  }, [])

  return (
    <Page>
      <Sidebar key={uniqueKey} />
      {/* AppList */}
    </Page>
  )
}

export default Home
