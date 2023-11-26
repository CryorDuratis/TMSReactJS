import React from "react";
import ReactDoM from "react-dom/client";

function MainComponent() {

    return (
        <>
            {/*  header */}
            <header>
                {/* logo */}
                <img src="./logo.webp"/>
                {/* logged in ? button */}
                <button>
                    {/* profile icon, username, dropdown arrow */}
                    <img src="./profile.png" />
                    <h1>username</h1>
                </button>
                    {/* edit profile overlay */}
                        {/* edit profile form */}
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
        </>
    )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<MainComponent />)