import React, { Component } from 'react';
import Style from '../../assets/styles/TrainTicket.css';

class voucherCodes extends Component {
  render() {
    const {
      couponCodes,
      senderName,
      senderEmail,
      handleCouponCodesChange,
      handleFieldChange,
    } = this.props;
    return (
      <div className={Style.formContainer}>
        <div className={Style.ticketContainer}>
          <div>
            <p className={Style.inputContainer}>
              <input
                type="text"
                name="senderName"
                className={Style.loginInput}
                placeholder="Enter Your Name"
                value={senderName}
                onChange={e => handleFieldChange(e, 'senderName')}
              />
            </p>
            <p className={Style.inputContainer}>
              <input
                type="email"
                name="senderEmail"
                className={Style.loginInput}
                placeholder="Enter Your Email"
                value={senderEmail}
                onChange={e => handleFieldChange(e, 'senderEmail')}
              />
            </p>
          </div>
        </div>
        <div>
          <textarea
            className={Style.Tickets}
            type="text"
            value={couponCodes}
            placeholder="Enter the voucher codes for the tickets "
            onChange={handleCouponCodesChange}
          />
        </div>
      </div>
    );
  }
}

export default voucherCodes;
