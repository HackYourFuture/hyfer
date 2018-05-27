import React, { Component } from 'react';
import Styles from '../../assets/styles/reset.css'

class Reset extends Component {

  render() {

    return (
      <div>
        <div className={Styles.container}>
          <header>
            <span>
              Thank you for filling out the information!
            </span>
          </header>
          <section>
            <p>
              Your email sent with the coupon code link / voucher at the email address you provided.
               Please enjoy, and let us know if there’ s anything else we can help you with.
            </p>
          </section>
          <footer>
            <strong>Hack Your Future Team</strong>
          </footer>

        </div>
      </div>
    );
  }
}

export default Reset
