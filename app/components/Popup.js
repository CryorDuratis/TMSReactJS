import Axios from "axios"
import Cookies from "js-cookie"
import React, { useState, useRef, useEffect } from "react"

function Popup(props) {
  const popupRef = useRef(null)
  const { grouplist } = props
  const [selectedlist, setselectedlist] = useState(props.roles !== "" ? props.roles.split(",") : [])

  // closes popup if clicked outside, sends selected roles array as string to parent
  useEffect(() => {
    const handleOutsideClick = event => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        props.onClose()
      }
    }
    props.setRoles(selectedlist.join(","))

    document.addEventListener("mousedown", handleOutsideClick)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [props.onClose])

  // update selected list array
  const handleCheckboxChange = event => {
    const value = event.target.value
    setselectedlist(prevselect => {
      if (prevselect.includes(value)) {
        return prevselect.filter(selected => selected !== value)
      } else {
        return [...prevselect, value]
      }
    })
  }

  return (
    <div className={`popup ${props.isOpen ? "open" : ""}`} style={{ left: 0 }} ref={popupRef}>
      Select Roles:
      <br />
      {grouplist.map((groupname, index) => (
        <label key={index} style={{ display: "flex", flexDirection: "row" }}>
          <input type="checkbox" name="roles" value={groupname} checked={selectedlist.includes(groupname)} onChange={handleCheckboxChange} /> {groupname}
        </label>
      ))}
    </div>
  )
}

export default Popup
