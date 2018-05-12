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
import { LOGIN_STATE_CHANGED, uiStore } from './store'
import NotFound from './Pages/NotFound'

const defaultState = {
    isLoggedIn: false,
}

class App extends Component {
    state = { ...defaultState }

    // For any new Secure Routes we can adding them here:
    routes = [
        { exact: true, path: '/modules', component: Modules },
        { exact: true, path: '/users', component: Users },
        { exact: true, path: '/profile', component: Profile },
        { exact: true, path: '/currentUserProfile', component: currentUserProfile },
        { exact: true, path: '/userAccount', component: userAccount },
        { exact: true, path: '/TrainTicket', component: TrainTicket },
        { exact: true, path: '/homework', render: props => <ClassPage {...props} studentClass={studentClasses[0]} /> },
    ]

    isRoute = path => {
        return this.routes.find(element => {
            return element.path === path;
        })
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

    componentDidMount() {
        uiStore.subscribe(mergedData => {
            if (mergedData.type === LOGIN_STATE_CHANGED) {
                this.setState({
                    isLoggedIn: mergedData.payload.isLoggedIn
                })
            }
        })
    }

    render() {
        // when ever there is props ~> there is a route existed
        const routeProps = this.isRoute(window.location.pathname)

        const redirectToDefault = window.location.pathname === '/' && <Redirect from='/' to='/timeline' />
        const passToSecureRoute = this.state.isLoggedIn && routeProps && <Route {...routeProps} />
        return (
            <BrowserRouter>
                <React.Fragment>
                    <Header />
                    <Notifications />
                    <Switch>
                        <Route path='/timeline' exact component={TimeLine} />
                        { // Redirect to the timeline if the pathname doesn't matches
                            redirectToDefault
                        }
                        { // Render wich secure route the user did specify
                            passToSecureRoute
                        }
                        {
                            // For who created this route could you please make it in one line 
                            // helping Making it secure if it's possible, I don't know if this
                            // will help with a new Ideas :D
                            // https://reacttraining.com/react-router/web/example/url-params
                            studentClasses.map(studentClass => (
                                <Route key={studentClass} path={"/homework/" + studentClass} exact
                                    render={props => <ClassPage {...props} studentClass={studentClass} />} />
                            ))
                        }
                        <Route path="*" exact component={() => NotFound} />
                    </Switch>
                    <Footer />
                </React.Fragment>
            </BrowserRouter>
        )
    }
}


export default App
