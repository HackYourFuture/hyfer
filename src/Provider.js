import React from 'react'

/* 
    CONTEXT API
    - won't work if you don't have:
    -- react and react-dom Modules should be at least v16.3
*/

// setting up the Store Constructor
// - Store: is a noraml Constructor 
// -- and it's spically to make a huge
// -- Object on the whole Application level
const Store = function () {
    const state = {}
    return {
        get state() { return this._state },
        _state: { ...state },
        set: function (item) {
            this._state = {
                ...this._state,
                ...item
            }
        }
    }
}

// exporting a Store Inctence for any other use
export const appStore = new Store()

// setting up the React Context API
export const Context = React.createContext('No Provider Value Found')

// Setting up the Provider
// No need for this step here 
// - it should be in the root
// - of the application but it's
// - making it easier to use and release
export const Provider = (props) => (
    // we need a value for the Provider that it will be on the whole app or a part of it
    // if the Provider Component doesn't contains any value we will use the appStore Object
    <Context.Provider value={props.value || appStore}>
        {props.children}
    </Context.Provider>
)

// any Context API needs a consumer that it will release the value
// - of the Provider By a function! ~> when ever you use a consumer
// -- it excepts a callback function as a child that will give the appility
// -- to use what ever the value of the Provider
export const Consumer = (props) => (
    <Context.Consumer>
        {props.children}
    </Context.Consumer>
)
