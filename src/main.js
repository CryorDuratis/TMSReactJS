import React from "react";

function MainComponent() {

    return (
        // header
            // logo
            // logged in ? hello {user}, profile icon, log out button
                // edit profile overlay
                    // edit profile form
        // main body
            // log in ? 
                // log in form
            // logged in ?
                // left side bar
                    // sidebar nav
                    // admin ? admin button
                // app dashboard ?
                    // app list
                        // app cards
                            // app form (to edit)
                    // app form (to create)
                // user management dashboard ?
                    // user list
                        // user cards
                            // user form (to edit)
                                // user group drop down multiselect
                    // user form (to create)
                        // user group drop down multiselect
        // footer
    )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<MainComponent />)