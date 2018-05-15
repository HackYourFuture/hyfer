import React, { Component } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { studentClasses } from "../src/store/HomeworkStore"

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
import ClassPage from "./Pages/Homework/ClassPage"
import cookie from 'react-cookies'
import Notifications from 'react-notify-toast'
import NotFound from './Pages/NotFound'
import Popup from './components/Popup'

import {
    LOGIN_STATE_CHANGED,
    ISTEACHER_STATE_CHANGED,
    ISSTUDENT_STATE_CHANGED,
    uiStore
} from './store'


const defaultState = {
    isLoggedIn: false,
    isATeacher: false,
    isStudent: false,
    update: true, // it's just for the shouldcomponentupdate() available
    scope: ['public'],
}

const { pathname } = window.location
class App extends Component {
    state = { ...defaultState }

    // For any new Secure Routes we can adding them here:
    routes = {
        teacher: [
            { exact: true, path: '/modules', component: Modules },
            { exact: true, path: '/users', component: Users },
            { exact: true, path: '/profile', component: Profile },
            { exact: true, path: '/userAccount', component: userAccount },
            { exact: true, path: '/TrainTicket', component: TrainTicket },
        ],
        student: [
            { exact: true, path: '/homework', render: props => <ClassPage {...props} studentClass={studentClasses[0]} /> },
        ],
        guest: [ // and all of the users can share some stuff
            { exact: true, path: '/currentUserProfile', component: currentUserProfile },
        ],
        public: [
            { exact: true, path: '/timeline', component: TimeLine },
        ],
    }
    // this will contain the Route props from the user scopes
    securedRouteProps = []
    setUserRouteProps = item => {
        // Only the Objects that has the same path property
        const value = this.securedRouteProps.find(obj => {
            return obj.path === item.path
        })
        // - pushing a clean type of the user scopes routes
        // -- if the returned from .find() Method is 'undefined'
        // -- then we need it
        if (!value) this.securedRouteProps.push(item)
        return value
    }

    isRoute = (path, scopes) => {
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
    }

    componentDidMount = () => {
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
        return isLoggedIn && update
    }

    componentWillUpdate(prevProps, prevState) {
        // NOTE: NO BODY CAN ARRIVE HERE IF HE IS NOT LOGGED IN
        const { isATeacher, isStudent, scope } = prevState
        const rolled_to_be = rolled => {
            this.setState({
                scope: scope.concat(rolled),
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
        this.isRoute(pathname, prevState.scope)
    }

    render() {
        // - calling isRoute() method for Initial check for the route
        // -- and assignin it in the ( securedRouteProps ) Array that
        // -- will contain all of the same user scope paths & props
        this.isRoute(pathname)
        return (
            <BrowserRouter>
                <React.Fragment>
                    <Header />
                    <Popup />
                    <Notifications />
                    <Switch>
                        {
                            this.securedRouteProps.map(item => <Route key={item.path} {...item} />)
                        }
                        {   // For who created this route could you please make it in one line
                            // helping Making it secure if it's possible, I don't know if this
                            // will help with a new Ideas :D
                            // https://reacttraining.com/react-router/web/example/url-params
                            studentClasses.map(studentClass => (
                                <Route key={studentClass} path={"/homework/" + studentClass} exact
                                    render={props => <ClassPage {...props} studentClass={studentClass} />} />
                            ))
                        }
                        { // if Only the route is the root ~> '/' redirect him to the '/timeline' route
                            (pathname === '/') && <Redirect from='/' to='/timeline' />
                        }
                        { // Checking if the route doesn't existes we can handle it with 404 page
                            (!this.securedRouteProps.length) && <Route path="*" exact render={<NotFound />} />
                        }
                    </Switch>
                    <Footer />
                </React.Fragment>
            </BrowserRouter>
        )
    }
}


export default App
