// import node modules
import React from "react"

function Container(props) {
  const styled = {
    height: props.height || "",
    width: props.width || ""
  }
  return (
    <div className={props.class} style={styled}>
      {props.children}
    </div>
  )
}

export default Container
