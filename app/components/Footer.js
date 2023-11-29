import React from "react"
import Container from "./Container"

function Footer() {
  return <Container class="footer center-children bgclr-accent">Copyright &copy; {new Date().getFullYear()}</Container>
}

export default Footer
