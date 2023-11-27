// import node modules
import React from "react"

function Container(props) {
  const styled = {
    width: props.width || "",
    height: props.height || "",
  }

  return <div style={styled}>{props.children}</div>
}

export default Container
