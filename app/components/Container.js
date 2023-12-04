// import node modules
import React from "react"

function Container(props) {
  if (props.key)
    return (
      <div key={props.key} className={props.class}>
        {props.children}
      </div>
    )
  else return <div className={props.class}>{props.children}</div>
}

export default Container
