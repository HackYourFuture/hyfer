import React, { Component } from 'react'
import Style from "../../assets/styles/TrainTicket.css"

class voucherCodes extends Component {
  render() {
    const { handleCouponCodesChange }=this.props
    return (
      <div>
        <div className={Style.ticketContainer}>
          <textarea className={Style.Tickets}
            type="text"
            placeholder="Enter the voucher codes for the tickets "
            onChange={handleCouponCodesChange}>
          </textarea>
        </div>
      </div>
    );
  }
}

export default voucherCodes
