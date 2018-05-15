import React, { Component } from 'react'
import { uiStore } from '../../store'
const defaultState = {
    isEmail: false,
    isLoggedIn: true,
    submited: false,
    email_input: '',
    confirm_email_input: ''
}
//Jawhar is working to handle errors.
class Popup extends Component {
    state = {
        ...defaultState
    }   
    componentDidMount = () => {
        uiStore.subscribe(mergedData => {
            if (mergedData.type) {
                this.setState({
                    isEmail: mergedData.payload.isEmail,
                    isLoggedIn: mergedData.payload.isLoggedIn
                });
            }
        })

    }
    handleChange = (e) => {
        this.setState({
            email_input: e.target.value,
        })
    }
    handleConfirmChange = (e) => {
        this.setState({
            confirm_email_input: e.target.value
        })
    }

    handleSubmit = () => {
        /* UiStore.getState(): to continue*/
        const { email_input, confirm_email_input } = this.state
        if (email_input !== confirm_email_input) {
            return console.error("the emails didn't match ")             
        }
        const { id } = uiStore.getState()
        const data = {
            id,
            email: email_input
        }
        const token = localStorage.getItem('token')
        fetch(`http://localhost:3000/api/set-email`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            credentials: 'same-origin',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            this.setState({ submited: true })
            return res.json()
        })
            .then(console.log)
            .catch(error => console.error('Error:', error))
    }
    PopUpContent = () => {
        return (
            <div className='Popup'>
                <input
                    onChange={this.handleChange}
                    value={this.state.email_input}
                    type='email'
                    placeholder='Please Enter Your Email'
                />
                <input
                    onChange={this.handleConfirmChange}
                    value={this.state.confirm_email_input}
                    type='email'
                    placeholder='Confirm Your Email'
                />
                <button onClick={this.handleSubmit /* UiStore.getState(): to continue*/}>
                    Submit
                    </button>

            </div>
        )
    }
    render() {
        const notUndefined = typeof this.state.isEmail !== 'undefined'
        const { isEmail, isLoggedIn, submited } = this.state
        const { PopUpContent } = this
        if (notUndefined && !isEmail && !isLoggedIn && !submited) {
            return PopUpContent()
        } else {
            return ''
        }
    }
}

export default Popup;