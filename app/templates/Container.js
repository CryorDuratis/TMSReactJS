// import node modules
import React from "react"

function Container(props) {
  if (props.listkey) {
    return (
      <div key={props.listkey} className={props.class}>
        {props.children}
      </div>
    )
  } else return <div className={props.class}>{props.children}</div>
}

export default Container
