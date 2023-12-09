import React from "react"
import Container from "../templates/Container"

function AppList() {
  return (
    <Container class="bgclr-light1 content-container">
      <div className="flex-row" style={{ justifyContent: "space-between", whiteSpace: "nowrap" }}>
        <h2>App List</h2>

        <button type="button" onClick={(e) => createGroup(e)} className="gobutton">
          Create App
        </button>
      </div>

      <Container class="content-wrapper">
        <div className="grid-header">
          <strong>App Acronym</strong>
          <strong>App Running Number</strong>
          <strong>App Description</strong>
          <strong>App Start Date</strong>
          <strong>App End Date</strong>
          <strong>Create</strong>
          <strong>Open</strong>
          <strong>To Do List</strong>
          <strong>Doing</strong>
          <strong>Done</strong>
        </div>
        <div className="edit-form-container">
          <p>hi</p>
        </div>
      </Container>
    </Container>
  )
}

export default AppList
