import React, { Component } from 'react'
import { uiStore } from '../../store'
import { warning, errorMessage, success } from '../../notify'

const defaultState = {
    isEmail: false,
    isLoggedIn: true,
    submited: false,
    email_input: '',
    confirm_email_input: ''
}

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
        const { email_input, confirm_email_input } = this.state
        if (email_input !== confirm_email_input) {
            return warning("the emails didn't match ")
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
            if (!res.ok) throw res
            this.setState({ submited: true })
            return res.json()
        }).then(param => success('Your e-mail has been inserted succefully'))
            .catch(errorMessage)
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
                <button onClick={this.handleSubmit}>
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