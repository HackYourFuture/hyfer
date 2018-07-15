import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import VoucherCodes from './voucherCodes';
import StudentList from './StudentList';
import { sendAnEmail } from '../../util';
import Wrap from './Wrap';
import Reset from './reset';
import Styles from '../../assets/styles/TrainTicket.css';
import Icon from '@material-ui/core/Icon';
import Badge from './Badge';
import { errorMessage } from '../../notify';
const token = localStorage.getItem('token');

class TrainTicket extends Component {
  state = {
    couponCodes: '',
    reservedTickets: '',
    remainingCards: '',
    members: '',
    searchMember: '',
    filterByGroupName: '',
    selectedStudents: '',
    senderName: '',
    senderEmail: '',
    openModal: false,
    stepIndex: 0,
    noAvailableTickets: false,
    redirect: false,
  };
  filterStudents = () => {
    const selectedStudents = this.state.members.filter(
      member => member.selected
    );
    const couponCodes = this.state.couponCodes;
    const reservedTickets = couponCodes.slice(0, selectedStudents.length);
    const remainingCards = couponCodes.filter(
      e => !reservedTickets.includes(e)
    );

    this.setState({
      selectedStudents,
      reservedTickets,
      remainingCards,
      openModal: !this.state.openModal,
    });
  };
  handleCheckModal = () => {
    this.setState({
      openModal: !this.state.openModal,
    });
  };

  componentDidMount() {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(res => res.json())
      .then(data => {
        const newData = data.map(member => {
          return {
            ...member,
            selected: false,
          };
        });
        this.setState({
          members: newData,
        });
      })
      .catch(errorMessage);
  }
  handleFieldChange = (event, field) => {
    this.setState({ [field]: event.target.value });
  };
  handleNext = () => {
    const { stepIndex } = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
    });
  };

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  };

  handleSubmit = () => {
    let text;
    const senderName = this.state.senderName;
    const sender = this.state.senderEmail;
    const subject = 'Train Tickets for Next Sunday';
    const couponCodes = this.state.couponCodes;
    const emails = this.state.selectedStudents.map(student => student.email);
    for (let i = 0; i < couponCodes.length; i++) {
      text = `
      <div>
      <header>
        <strong>Dear Student,</strong>
      </header>
       <section>
        <p>Please see attached the links to open your train tickets.</sp><br/>
        <em>https://www.ns.nl/producten/coupon/${couponCodes[i]}</em>
       </section>
      <footer>
        <p>Doors <em>o</em>pen around 11:30 earliest</p><br/>
        <strong>See you Sunday!</strong> <br/>
        <strong>${senderName}</strong>                
      </footer>
      </div>
      `;
      sendAnEmail(emails[i], sender, subject, text);
    }
    this.setState({
      stepIndex: 3,
      couponCodes: '',
      reservedTickets: '',
      remainingCards: '',
      senderName: '',
      senderEmail: '',
    });
  };
  handleReset = () => {
    this.setState({
      redirect: true,
    });
  };

  handleCouponCodesChange = e => {
    this.setState({
      couponCodes: e.target.value
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '')
        .map(line => line.replace(/Couponcode:\s+/g, ''))
        .map(couponCode => {
          return couponCode;
        }),
    });
  };

  handelSelected = member => {
    member.selected = !member.selected;

    const selectedStudents = this.state.members.filter(
      member => member.selected
    );
    const couponCodes = this.state.couponCodes;
    const reservedTickets = couponCodes.slice(0, selectedStudents.length);

    if (selectedStudents.length > couponCodes.length) {
      this.setState({
        noAvailableTickets: true,
        reservedTickets,
      });
    } else {
      this.setState({
        noAvailableTickets: false,
        reservedTickets,
      });
    }
  };

  getStepContent = stepIndex => {
    switch (stepIndex) {
      case 0:
        return (
          <VoucherCodes
            couponCodes={this.state.couponCodes}
            senderName={this.state.senderName}
            senderEmail={this.state.senderEmail}
            handleFieldChange={this.handleFieldChange}
            handleCouponCodesChange={this.handleCouponCodesChange}
          />
        );
      case 1:
        return (
          <StudentList
            couponCodes={this.state.couponCodes}
            noAvailableTickets={this.state.noAvailableTickets}
            searchMember={this.state.searchMember}
            filterByGroupName={this.state.filterByGroupName}
            handleFieldChange={this.handleFieldChange}
            members={this.state.members}
            handelSelected={this.handelSelected}
            selected={this.state.selected}
            closeModal={this.handleCheckModal}
            visible={this.state.openModal}
            selectedStudents={this.state.selectedStudents}
            filterStudents={this.filterStudents}
          />
        );
      case 2:
        return (
          <Wrap
            remainingCards={this.state.remainingCards}
            selectedStudents={this.state.selectedStudents}
            reservedTickets={this.state.reservedTickets}
          />
        );
      case 3:
        return <Reset />;
      default:
        return null;
    }
  };

  render() {
    const {
      stepIndex,
      redirect,
      couponCodes,
      senderName,
      senderEmail,
    } = this.state;
    const isEnabled =
      senderName.length > 0 && couponCodes.length > 0 && senderEmail.length > 0;
    if (redirect) {
      return <Redirect from="/TrainTicket" to="/" />;
    }
    return (
      <div>
        <div className={Styles.StepContainer}>
          <ul className={Styles.progressBar}>
            <li className={stepIndex === 0 ? Styles.active : ''}>
              coupon Codes{' '}
            </li>
            <li className={stepIndex === 1 ? Styles.active : ''}>
              {' '}
              select students
            </li>
            <li className={stepIndex === 2 ? Styles.active : ''}>confirm</li>
          </ul>
        </div>
        <div className={Styles.badgeContainer}>
          <Badge
            couponCodes={this.state.couponCodes}
            reservedTickets={this.state.reservedTickets}
          />
        </div>
        <div className={Styles.content}>{this.getStepContent(stepIndex)}</div>
        <div className={Styles.footer}>
          <ul className={Styles.btnList}>
            <li>
              <button
                className={
                  stepIndex === 0 || stepIndex === 3
                    ? Styles.displayNone
                    : Styles.back
                }
                disabled={stepIndex === 0}
                onClick={this.handlePrev}
                title="Back"
              >
                <Icon color="action">arrow_back</Icon>
              </button>
            </li>
            <li>
              <button
                className={`${stepIndex > 1 ? Styles.displayNone : Styles.next}
              ${!isEnabled ? Styles.disabledBtn : ''}
              `}
                disabled={!isEnabled}
                onClick={this.handleNext}
                title="Next"
              >
                <Icon color="action">navigate_next</Icon>
              </button>
              <button
                className={stepIndex === 2 ? Styles.next : Styles.displayNone}
                onClick={this.handleSubmit}
                title="Send"
              >
                <Icon color="action">send</Icon>
              </button>
              <button
                className={stepIndex === 3 ? Styles.next : Styles.displayNone}
                onClick={this.handleReset}
                title="settings backup restore"
              >
                <Icon color="action">settings_backup_restore</Icon>
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default TrainTicket;
