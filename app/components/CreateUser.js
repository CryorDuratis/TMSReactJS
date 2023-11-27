import { Axios } from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function CreateUser(props) {
  const [title, setTitle] = useState()
  const [body, setBody] = useState()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post("/admin/create", { title, body, token })
      if (response.success) {
        props.addToast("create user success")
        console.log("new user created")
      } else {
        props.addToast(`encountered ${props.error}`)
      }
      useNavigate("/admin")
    } catch (e) {
      props.addToast("Something is wrong, http request failed")
      console.log("There was a problem")
    }
  }
}

export default CreateUser
