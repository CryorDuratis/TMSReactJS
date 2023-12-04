import React, { useContext, useEffect } from "react"
import Container from "./Container"
import StateContext from "../StateContext"

function ErrorPage() {
  useEffect(() => {
    console.log("errorpage was loaded")
  }, [])

  const appState = useContext(StateContext)

  return <Container>{appState.error ? "loading..." : appState.error}</Container>
}

export default ErrorPage
