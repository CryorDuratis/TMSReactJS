import React, { useState, useRef, useEffect } from "react"

const Popup = ({ isOpen, onClose, buttonRef }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 })
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

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const popupRect = popupRef.current.getBoundingClientRect()

      const bottom = buttonRect.top + window.scrollY
      const left = buttonRect.left + window.scrollX + buttonRect.width / 2 - popupRect.width / 2

      setPosition({ bottom, left })
    }
  }, [isOpen, buttonRef])

  return (
    <div className={`popup ${isOpen ? "open" : ""}`} style={{ bottom: position.bottom, left: position.left }} ref={popupRef}>
      Select Roles:
      <label>
        <input type="checkbox" name="fruits" value="apple" /> Apple
      </label>
    </div>
  )
}

export default Popup
