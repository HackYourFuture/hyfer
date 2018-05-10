import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from "mobx-react"
import HomeworkStore from "./store/HomeworkStore"
import App from './App'
import registerServiceWorker from './registerServiceWorker'

const Hyfer = () => (
    <Provider HomeworkStore={HomeworkStore}>
        <App />
    </Provider>
)

ReactDOM.render(<Hyfer />, document.getElementById('root'))
registerServiceWorker()
