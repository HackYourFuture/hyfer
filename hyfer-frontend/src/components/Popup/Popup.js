import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import styles from './Popup.css';
import ModalDialog from '../../Helpers/Modal/Modal';
import { warning, errorMessage, success } from '../../notify';

const defaultState = {
  submitted: false,
  email_input: '',
  confirm_email_input: '',
};

@inject('global')
@observer
class Popup extends Component {
  state = {
    ...defaultState,
  };

  handleChange = e => {
    this.setState({
      email_input: e.target.value,
    });
  };

  handleConfirmChange = e => {
    this.setState({
      confirm_email_input: e.target.value,
    });
  };

  handleSubmit = () => {
    const { email_input, confirm_email_input } = this.state;
    if (email_input !== confirm_email_input) {
      return warning("the emails didn't match ");
    }
    const { id } = this.props.global.currentUser;
    const data = {
      id,
      email: email_input,
    };
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/set-email`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      credentials: 'same-origin',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw res;
        this.setState({ submitted: true });
        return res.json();
      })
      .then(() => success('Your e-mail has been inserted successfully'))
      .catch(errorMessage);
  };

  popUpContent = visible => {
    return (
      <ModalDialog
        visible={visible}
        closeModal={this.state.submitted}
        close={true}
      >
        <input
          className={styles.Popup_input}
          onChange={this.handleChange}
          value={this.state.email_input}
          type="email"
          placeholder="Please Enter Your Email"
        />
        <input
          className={styles.Popup_input}
          onChange={this.handleConfirmChange}
          value={this.state.confirm_email_input}
          type="email"
          placeholder="Confirm Your Email"
        />
        <button className={styles.Popup_button} onClick={this.handleSubmit}>
          Submit
        </button>
      </ModalDialog>
    );
  };

  render() {
    const { currentUser, isLoggedIn } = this.props.global;
    if (currentUser && !currentUser.email && !isLoggedIn && !this.state.submitted) {
      return this.popUpContent(true);
    } else {
      return '';
    }
  }
}

export default Popup;
