import React, { useEffect } from "react"
import Container from "./Container"

function ErrorPage() {
  useEffect(() => {
    console.log("errorpage was loaded")
  }, [])

  return <Container>something</Container>
}

export default ErrorPage
