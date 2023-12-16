import React, { useContext, useEffect } from "react"
import Container from "../templates/Container"
import StateContext from "../StateContext"
import Page from "../templates/Page"

function TempPage() {
  useEffect(() => {
    console.log("temp page was loaded")
  }, [])

  const appState = useContext(StateContext)

  switch (appState.error) {
    case "route":
      return (
        <Page class="center-children">
          <h1>
            404 Error <br />
            Route Not Found
          </h1>
          <br />
          <p>The page you are looking for may have been moved, or does not exist.</p>
        </Page>
      )
    case "server":
      return (
        <Page class="center-children">
          <div className="list-container">
            <h1>
              500 Error <br />
              Internal Server Error
            </h1>
            <br />
            <p>Something went wrong, please try again later.</p>
          </div>
        </Page>
      )
    default:
      return (
        <Page class="center-children">
          {" "}
          <h1>Loading...</h1>
        </Page>
      )
  }
}

export default TempPage
