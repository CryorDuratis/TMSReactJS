import React from "react"
import ReactDOM from "react-dom/client"
import DispatchContext from "./DispatchContext"

function MainComponent() {
  return (
    <DispatchContext.Provider value={dispatch}>
      <header>
        <img src="logo.webp" />
        {/* logged in ? button */}
        <button>
          <img src="profile.png" />
          <h1>username &#9660;</h1>
        </button>
        {/* profile drop down modal*/}
        <div>
          {/* edit profile */}
          <div>
            <img src="edit.png" />
            <h3>edit profile</h3>
          </div>
          {/* logout */}
          <div>
            <img src="logout.png" />
            <h3>log out</h3>
          </div>
        </div>
      </header>
      {/* main body */}
      <div>
        {/* log in ?  */}
        {/* log in form */}

        {/* logged in ? */}
        {/* left side bar */}
        {/* sidebar nav */}
        {/* admin ? admin button */}
        {/* app dashboard ? */}
        {/* app list */}
        {/* app cards */}
        {/* app form (to edit) */}
        {/* app form (to create) */}
        {/* user management dashboard ? */}
        {/* user list */}
        {/* user cards */}
        {/* user form (to edit) */}
        {/* user group drop down multiselect */}
        {/* user form (to create) */}
        {/* user group drop down multiselect */}
      </div>
      {/* footer */}
      <footer></footer>
    </DispatchContext.Provider>
  )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<MainComponent />)

if (module.hot) {
  module.hot.accept()
}
