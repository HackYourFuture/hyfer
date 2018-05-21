import React, { Component } from 'react'
import VoucherCodes from "./voucherCodes"
import StudentList from './StudentList'
import Wrap from './Wrap'
import Styles from '../../assets/styles/TrainTicket.css'
import { error_bundle } from '../../notify';

const token = localStorage.getItem("token")

class TrainTicket extends Component {
  state = {
    couponCodes: '',
    members: '',
    selectedStudents:'',
    senderName: '',
    senderEmail: '',
    openModal:false,
    stepIndex: 0,
  }
  filterStudents = () => { 
    const selectedStudents = this.state.members.filter(member => member.selected)
    this.setState({
      selectedStudents,
      openModal: !this.state.openModal,
    })
  }
  handleCheckModal = ()=>{ 
    this.setState({
      openModal: !this.state.openModal
    })
  }
  componentWillMount() {
    fetch('http://localhost:3000/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      }
    })
      .then(res => res.json() )
      .then(data => {
        const newData = data.map(member => {        
            return {
              ...member,
              selected: false
            };
        })
        this.setState({
          members:newData
        })
        }).catch(error_bundle)
  }
  handleFieldChange = (event, field) => {
    this.setState({ [field]: event.target.value });
  };
  handleNext = () => {
    const { stepIndex } = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    })
  }

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  }

  getStepContent = (stepIndex) => {

    switch (stepIndex) {
      case 0:
        return <VoucherCodes
          couponCodes={this.state.couponCodes}  
          handleFieldChange={this.handleFieldChange}
          handleCouponCodesChange={this.handleCouponCodesChange} />
      case 1:
        return <StudentList
          members={this.state.members}
          handelSelected={this.handelSelected}
          selected={this.state.selected}
          closeModal={this.handleCheckModal}
          visible={this.state.openModal}
          selectedStudents={this.state.selectedStudents}
          filterStudents={this.filterStudents}
        />
      case 2:
        return <Wrap />
      default:
        return ''
    }
  }

  handleCouponCodesChange = (e) => {
    this.setState({
      couponCodes: e.target.value
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '')
        .map(line => line.replace(/Couponcode:\s+/g, ''))
        .map((couponCode, i) => {
          return {
            couponCode,
            id: i + 1,
          }
        })
    })
  }

  handelSelected = (member) => { 
    member.selected=!member.selected
  }
  render() {
    const { stepIndex } = this.state
    return (
      <div>
        < div className={Styles.StepContainer} >
          < ul className={Styles.progressBar} >
            <li className={stepIndex === 0 ? Styles.active : ''}>coupon Codes </li>
            <li className={stepIndex === 1 ? Styles.active : ''}> select students</li>
            <li className={stepIndex === 2 ? Styles.active : ''}>confirm</li>
          </ul>
        </div>
        <h4>Available Tickets: {this.state.couponCodes.length}</h4>
        <div className={Styles.content}>
          {this.getStepContent(stepIndex)}
        </div>
        <div className={Styles.footer}>
          <ul className={Styles.btnList}>
            <li>
              <button className={stepIndex === 0 ? Styles.disabledBtn : Styles.back}
                disabled={stepIndex === 0}
                onClick={this.handlePrev}
              >Back</button>
            </li>
            <li>
              <button className={Styles.next}
                onClick={this.handleNext} >
                {stepIndex === 2 ? 'Finish' : 'Next'}
              </button>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default TrainTicket
