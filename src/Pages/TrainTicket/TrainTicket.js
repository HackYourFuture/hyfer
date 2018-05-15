import React, { Component } from 'react'
import VoucherCodes from "./voucherCodes"
import SelectStudent from './SelectStudent'
import Wrap from './Wrap'
import Styles from '../../assets/styles/TrainTicket.css';

class TrainTicket extends Component {
  state = {
    couponCodes: [],
    teamMembers: [],
    stepIndex: 0,
  }

  handleNext = () => {
    const token = localStorage.getItem("token")
    fetch('http://localhost:3000/api/students', {
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(data => {
        const { stepIndex } = this.state;
        this.setState({
          teamMembers: data,
          stepIndex: stepIndex + 1,
          finished: stepIndex >= 2,
        })
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
          handleCouponCodesChange={this.handleCouponCodesChange} />
      case 1:
        return <SelectStudent
          teamMembers={this.state.teamMembers} />
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
  render() {
    console.log(this.state.teamMembers)
    const { stepIndex } = this.state
    return (
      <div>
        < div className={Styles.container} >
          < ul className={Styles.progressBar} >
            <li className={stepIndex === 0 ? Styles.active : ''}>coupon Codes </li>
            <li className={stepIndex === 1 ? Styles.active : ''}> select students</li>
            <li className={stepIndex === 2 ? Styles.active : ''}>confirm</li>
          </ul>
        </div>
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
