// import node modules
import React, { useEffect } from "react"

// import components
import Sidebar from "../components/Sidebar"
import Page from "../templates/Page"
import TaskList from "./TaskList"

function TaskDashboard(props) {
  // check authentication and authorization on remount
  useEffect(() => {
    props.onLoad()
  }, [])

  return (
    <Page>
      <Sidebar />
      <TaskList />
    </Page>
  )
}

export default TaskDashboard
