import React, { Component } from 'react'
import VoucherCodes from "./voucherCodes"

class TrainTicket extends Component {
  state = {
    couponCodes: [],
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
    return (
      <div>
        <h5>Step</h5>
        <p>available ticket: {this.state.couponCodes.length}</p>
        <VoucherCodes
          handleChange={this.handleCouponCodesChange}
        />
      </div>
    );
  }
}

export default TrainTicket
