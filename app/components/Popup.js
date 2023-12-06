import Axios from "axios"
import Cookies from "js-cookie"
import React, { useState, useRef, useEffect } from "react"

function Popup(props) {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const popupRef = useRef(null)
  const [grouplist, setgrouplist] = useState([])
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

  // position the popup below button
  useEffect(() => {
    if (props.isOpen && props.buttonRef.current) {
      const buttonRect = props.buttonRef.current.getBoundingClientRect()
      const popupRect = popupRef.current.getBoundingClientRect()

      const bottom = buttonRect.top + window.scrollY
      const left = buttonRect.left + window.scrollX + buttonRect.width / 2 - popupRect.width / 2

      setPosition({ bottom, left })
    }
  }, [props.isOpen, props.buttonRef])

  // get list of groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        // Make fetch request to the server
        const token = Cookies.get("token")
        const response = await Axios.post("/group/getall", { groupname: "admin", token })
        // console.log("response ", response.data)

        // if not logged in
        if (response.data.unauth) {
          if (response.data.unauth === "login") {
            appDispatch({
              type: "logout",
              message: "Logged out"
            })
            navigate("/login")
          } else if (response.data.unauth === "role") {
            appDispatch({ type: "btoast", message: "Unauthorized page, redirecting to home" })
            navigate("/")
          }
          return
        }

        // Set the grouplist based on the server response
        setgrouplist(response.data.groupsData.map(obj => obj.groupname))

        // console.log("groups obtained ", grouplist)
      } catch (error) {
        console.error("Error fetching data:", error)
        // Handle errors as needed
      }
    }

    // Call the fetch function when the component mounts
    fetchGroups()
  }, [])

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
    <div className={`popup ${props.isOpen ? "open" : ""}`} style={{ bottom: position.bottom, left: position.left }} ref={popupRef}>
      Select Roles:
      <br />
      {grouplist.map((groupname, index) => (
        <label key={index}>
          <input type="checkbox" name="roles" value={groupname} checked={selectedlist.includes(groupname)} onChange={handleCheckboxChange} /> {groupname}
        </label>
      ))}
    </div>
  )
}

export default Popup
