import React from "react"

function Toast(props) {
  return (
    <div className="toasts">
      {props.messages.map((msg, index) => {
        return (
          <div key={index} className="toast alert alert-success text-center shadow-sm">
            {msg}
          </div>
        )
      })}
    </div>
  )
}

export default Toast
