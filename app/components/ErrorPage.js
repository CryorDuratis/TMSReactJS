import React, { useContext, useEffect } from "react"
import Container from "../templates/Container"
import StateContext from "../StateContext"
import Page from "../templates/Page"

function ErrorPage() {
  useEffect(() => {
    console.log("errorpage was loaded")
  }, [])

  const appState = useContext(StateContext)

  return <Page class="center-children">{appState.error ? <h1>{appState.error}</h1> : <h1>Loading...</h1>}</Page>
}

export default ErrorPage
