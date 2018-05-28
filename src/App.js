import React, { Component } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import './assets/styles/app.css'
import Header from './components/Header/Header'
import TimeLine from './Pages/Timeline/TimeLine'
import Footer from './components/Footer/Footer'
import Modules from './Pages/Modules/Modules'
import Users from './Pages/Users/Users'
import currentUserProfile from './Pages/Users/currentUserProfile'
import userAccount from './Pages/Users/userAccount'
import Profile from './Pages/Users/Profile'
import TrainTicket from './Pages/TrainTicket/TrainTicket'
import Homework from "./Pages/Homework/Homework"
import cookie from 'react-cookies'
import Notifications from 'react-notify-toast'
import NotFound from './Pages/NotFound'
import Popup from './components/Popup'

import { Provider, Consumer } from './Provider'

import {
    LOGIN_STATE_CHANGED,
    ISTEACHER_STATE_CHANGED,
    ISSTUDENT_STATE_CHANGED,
    uiStore
} from './store'
import { errorMessage } from './notify';


const defaultState = {
    isLoggedIn: false,
    isATeacher: false,
    isStudent: false,
    done: false,
    update: true, // it's just for the shouldcomponentupdate() available
    scope: ['public'],
}

const { pathname } = window.location

class App extends Component {

    /*** The Roles In Frontend ***/

    state = { ...defaultState }

    // For any new Secure Routes we can adding them here:
    // NOTE: if there is any new scope we wanna add here tell me
    // -- or Figure it your self 😐
    routes = {
        // labels for sub pages or with a functionality
        // -- for more info see Header.js
        teacher: [
            { exact: true, path: '/modules', component: Modules, name: 'Modules' },
            { exact: true, path: '/users', component: Users, name: 'Users' },
            { exact: true, path: '/profile', component: Profile, name: 'Profile' },
            { exact: true, path: '/homework', component: Homework, name: 'Homework' },
            { exact: true, path: '/homework/:classNumber', component: Homework },
            { exact: true, path: '/TrainTicket', component: TrainTicket, name: 'Train Ticket' },
        ],
        student: [
            { exact: true, path: '/users', component: Users, name: 'Users' },
            { exact: true, path: '/homework', component: Homework, name: 'Homework' },
            { exact: true, path: '/homework/:classNumber', component: Homework },
        ],
        guest: [ // and all of the users can share some stuff
            { exact: true, path: '/userAccount', component: userAccount, label: 'Manage Account' },
            { exact: true, path: '/currentUserProfile', component: currentUserProfile, label: 'My Profile' },
        ],
        public: [
            { exact: true, path: '/timeline', component: TimeLine, name: 'Timeline' },
        ],
        NotFound: { component: NotFound },
    }
    // this will contain the Route props from the user scopes
    securedRouteProps = []
    setUserRouteProps = item => {
        const { securedRouteProps } = this
        // Only the Objects that has the same path property
        const value = securedRouteProps.find(obj => {
            return obj.path === item.path
        })
        // - pushing a clean type of the user scopes routes
        // -- if the returned from .find() Method is 'undefined'
        // -- then we need it
        if (!value) securedRouteProps.push(item)
        return value
    }

    findRoutes = (path, scopes) => {
        // - this function is responsible on matching in 
        // -- the routes Object and returning the correct 
        // -- result if there is a one
        // the default scope is ['public']
        if (!scopes) scopes = this.state.scope
        let routeProps = {}
        scopes.forEach(scope => {
            routeProps = this.routes[scope].find((item, index) => {
                // - calling setUserRouteProps() method that will assign 
                // -- every route the user has an access to it
                this.setUserRouteProps(item)
                return item.path === path
            })
        })
        if (routeProps) return routeProps
    }

    componentWillMount() {
        let token = cookie.load('token')
        if (token && typeof token !== 'undefined') {
            token = JSON.parse(token)
        }
        else {
            token = ''
        }
        localStorage.setItem('token', token)
        // this is Only for checking if the user has a role Or Not
        uiStore.subscribe(mergedData => {
            const user_state = type => {
                this.setState({
                    [type]: mergedData.payload[type],
                    update: true,
                })
            }
            if (mergedData.type === LOGIN_STATE_CHANGED) user_state('isLoggedIn')
            if (mergedData.type === ISTEACHER_STATE_CHANGED) user_state('isATeacher')
            if (mergedData.type === ISSTUDENT_STATE_CHANGED) user_state('isStudent')
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        // - if the user is logged in pass him 
        // -- to the next componentWillUpdate() lifeCycle hook
        // -- Otherwise keep him on the public scope
        const { isLoggedIn, update } = nextState
        if (!isLoggedIn && update) {
            // - if he isn't logged in set the state as the lifecycle is done
            // -- and update is false making sure this will never called again
            // NOTE: this.setState() is async function. Why?! check this:
            // https://stackoverflow.com/questions/41278385/setstate-doesnt-update-the-state-immediately/41278440?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
            // << why am i telling you?! because I Really sufferd with it 💔 >>
            this.setState({ done: true, update: false })
        }
        return isLoggedIn && update
    }

    componentWillUpdate(prevProps, prevState) {
        // NOTE: NO BODY CAN ARRIVE HERE IF HE IS NOT LOGGED IN
        const { isATeacher, isStudent, scope } = prevState
        const rolled_to_be = someBody => {
            this.setState({
                // the next line to make sure that the role will never dublicate
                scope: scope.filter(item => item !== someBody).concat(someBody),
                // - without the next line the component will stuck in an infinte loop!!
                // -- Why?! because componentWillUpdate() Method is called each time the
                // -- state or the props changes BUT if the shouldComponentUpdate() returned
                // -- (false) then this will never called again :D
                update: false,
            })
        }
        // has the user any role?
        if (isATeacher) return rolled_to_be('teacher')
        if (isStudent) return rolled_to_be('student')
        return rolled_to_be('guest') // in All cases he is a guest because he is logged in
    }

    componentDidUpdate(prevProps, prevState) {
        // After all of the checking for login and Stuff
        // He need his page!!
        // - NOTE: this function here Only for assigning 
        // -- the user routes to the ( securedRouteProps ) Array
        // - AND NOTE: without this function the user will never
        // -- arrive to his distenation path
        if (!this.findRoutes(pathname, prevState.scope)) return this.setState({ done: true, update: false })
    }

    
    render() {
        const { isLoggedIn, isATeacher, isStudent, done, update } = this.state
        const { securedRouteProps } = this
        const main = {
            // main App Object should contain any thing for using on the whole app level
            main: {
                auth: {
                    isLoggedIn, isATeacher, isStudent
                },
                routes: securedRouteProps,
                lifeCycle: {
                    done, update
                }
            }
        }
        // - calling findRoutes() method Here for Initial check for the route
        // -- and assigning it in the ( securedRouteProps ) Array that
        // -- will contain all of the same user scope paths & props
        this.findRoutes(pathname)
        return (
            <Provider>{/* we setted up the Provider value as appStore in src/Provider.js */}
                <Consumer>{appStore => { // releasing the appStore Object
                    appStore.set(main) // setting up the appStore Object Content
                    return (
                        <BrowserRouter>
                            <React.Fragment>
                                <Header />
                                <Popup />
                                <Notifications />
                                <Switch>
                                    { // every Route the user has an access scope to it will be rendered here
                                        securedRouteProps.map(item => <Route key={item.path} {...item} />)
                                    }
                                    <Redirect exact strict from='/' to='/timeline' />
                                    { // the user isn't logged in OR the lifecycle done AND No route found render this Component
                                        (!this.state.isLoggedIn || this.state.done) && <Route {...this.routes.NotFound} />
                                    }
                                </Switch>
                                <Footer />
                            </React.Fragment>
                        </BrowserRouter>
                    )
                }}</Consumer>
            </Provider>
        )
    }

    componentDidCatch(error, info) {
        errorMessage(error)
    }
}


export default App
