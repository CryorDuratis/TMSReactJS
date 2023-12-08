// import node modules
import React, { useEffect } from "react"

// import components

import Sidebar from "../components/Sidebar"
import UserList from "../components/UserList"
import Page from "../templates/Page"

const generateuniqueKey = () => {
  return new Date().getTime().toString()
}

function UserMgmt(props) {
  var uniqueKey = ""
  useEffect(() => {
    uniqueKey = generateuniqueKey()
  }, [])

  return (
    <Page>
      <Sidebar key={uniqueKey} />
      <UserList />
    </Page>
  )
}

export default UserMgmt
