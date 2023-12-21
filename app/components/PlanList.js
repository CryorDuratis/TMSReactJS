// import node modules
import React, { useContext, useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import Axios from "axios"

// import components
import Container from "../templates/Container"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import UserCard from "./UserCard"
import Cookies from "js-cookie"
import PlanCard from "./PlanCard"

function PlanList() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { appid } = useParams()

  // managing rendering
  const [isLoading, setIsLoading] = useState(true)
  const [updateFlag, setUpdateFlag] = useState(false)
  const [editing, setEditing] = useState(0)
  const [error, setError] = useState("")
  // initial data
  const [planList, setPlanList] = useState([])
  // formdata states
  const [formData, setFormData] = useState("")

  // updates list when new user is created
  const updatePlanList = () => {
    console.log("update plan list called")
    setUpdateFlag(prev => !prev)
  }

  // display plan information on load, and on update
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        // Make authorization request to the server
        const token = Cookies.get("token")
        var response = await Axios.post("/checkgroup", { groupname: "Project Manager", token })

        // if not logged in
        if (response.data.unauth) {
          if (response.data.unauth === "login") {
            appDispatch({
              type: "logout",
              message: "Logged out"
            })
            navigate("/login")
          } else if (response.data.unauth === "role") {
            appDispatch({ type: "btoast", message: "Unauthorized page, redirecting back to apps" })
            navigate(pathname.split("/plans")[0])
          }
          return
        }

        // get plans
        response = await Axios.post("/plan/getall", { appid, token })

        // Set the state based on the server response
        setPlanList(response.data.plansData)
        setIsLoading(false)

        console.log("plans obtained ", response.data.plansData)
      } catch (error) {
        console.error("Error fetching data:", error)
        // Handle errors as needed
      }
    }

    // Call the fetch function when the component mounts
    fetchPlans()
  }, [updateFlag])

  return (
    <Container class="bgclr-light1 content-container">
      <div className="breadcrumb">
        <span onClick={e => navigate("/apps")}>Apps</span> / <span onClick={e => navigate(pathname.split("/plans")[0])}>App Dashboard</span> / Plans
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "80vw", justifyContent: "space-between" }}>
        <h2 style={{ wordWrap: "break-word" }}>{appid}</h2>
      </div>
      <Container class="create-form-container">
        <div className="plan-grid-header">
          <strong>Plan Name</strong>
          <strong>Start Date</strong>
          <strong>End Date</strong>
          <strong>Colour Display</strong>
        </div>
        <div className="list-card-container">
          <PlanCard plan={{ Plan_MVP_name: "", Plan_startDate: "", Plan_endDate: "" }} create={true} update={updatePlanList} planlist={planList} updateflag={updateFlag} />
        </div>
      </Container>
      <Container class="list-container">
        {isLoading
          ? "loading"
          : planList.map((plan, index) => (
              <div key={index} className="list-card-container">
                <PlanCard plan={plan} planlist={planList} listkey={index} update={updatePlanList} editing={editing} setEditing={setEditing} />
              </div>
            ))}
      </Container>
    </Container>
  )
}

export default PlanList
