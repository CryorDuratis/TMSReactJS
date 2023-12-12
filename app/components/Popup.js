import React, { useRef, useEffect } from "react"

function Popup(props) {
  const popupRef = useRef(null)

  // closes popup if clicked outside
  useEffect(() => {
    const handleOutsideClick = event => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        props.onClose()
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [props.condition])

  return (
    <div className={props.class} ref={popupRef}>
      {props.children}
    </div>
  )
}

export default Popup
