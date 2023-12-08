// import node modules
import React, { useEffect } from "react"

// import components

import Sidebar from "../components/Sidebar"
import UserList from "../components/UserList"
import Page from "../templates/Page"

function UserMgmt(props) {
  // check authentication and authorization on remount
  useEffect(() => {
    props.onLoad()
  }, [])

  return (
    <Page>
      <Sidebar />
      <UserList />
    </Page>
  )
}

export default UserMgmt
