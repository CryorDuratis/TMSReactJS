import React from "react"
import Container from "../templates/Container"

function AppList() {
  return (
    <Container class="bgclr-light1 content-container">
      <div className="flex-row" style={{ justifyContent: "space-between", whiteSpace: "nowrap" }}>
        <h2>App List</h2>

        <button type="button" onClick={e => createGroup(e)} className="gobutton">
          Create App
        </button>
      </div>

      <Container class="list-container">
        <div className="app-grid-header">
          <strong>App Acronym</strong> <strong>App Start Date</strong>
          <strong>App End Date</strong>
        </div>
        <div className="list-card-container">
          <p>hi</p>
        </div>
      </Container>
    </Container>
  )
}

export default AppList
