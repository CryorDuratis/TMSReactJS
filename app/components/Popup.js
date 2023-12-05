import React, { useEffect, useRef } from "react"

const Popup = ({ onClose }) => {
  const popupRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = event => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [onClose])

  return (
    <div ref={popupRef} className="popup">
      {/* Popup content */}
      <p>This is a popup</p>
    </div>
  )
}

export default Popup
