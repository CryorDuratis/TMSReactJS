import React, { useContext } from "react"
import StateContext from "../StateContext"

function Toast(props) {
  const appState = useContext(StateContext)

  return (
    <div className="toasts">
      {props.messages.map((msg, index) => {
        return (
          <div key={index} className={appState.toasttype ? "toast toast-success text-center shadow-sm" : "toast toast-error text-center shadow-sm"}>
            {msg}
          </div>
        )
      })}
    </div>
  )
}

export default Toast
