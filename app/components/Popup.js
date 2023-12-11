import React, { useRef, useEffect } from "react"

function Popup(props) {
  const popupRef = useRef(null)

  // closes popup if clicked outside, sends selected roles array as string to parent
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        props.onClose()
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [props.onClose])

  return (
    <div className={`popup ${props.isOpen ? "open" : ""}`} ref={popupRef}>
      {props.children}
    </div>
  )
}

export default Popup
