import React, { Component } from 'react';
import Style from "./style.css";

class TrainTicket extends Component {
  state = {
    couponCodes: '',
  }
  componentDidMount() { 
    fetch('https://api.github.com/teams/2275987/members', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/vnd.github.hellcat-preview+json',
        'Authorization': 'token 1865feb51fe0ce4353f0e2a656e521028a45f2b5',
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        })
      .catch(error => {
        console.log(error);
      });
  }
  
  handleChange = (e) => {
    this.setState({ couponCodes: e.target.value });
  }
  handleClick = () => {
    const KeyVal = this.state.couponCodes.replace(/\n/g, " ")
      .replace(/code:\s+/g, '')
      .split(' ')
      .reduce((p, c) => { p.push({ code: c }); return p }, [])
      console.log(KeyVal);
  }
  render() {
    return (
      <div>
        <div className={Style.ticketContainer}>
          <textarea className={Style.Tickets}
            type="text"
            placeholder="Tickets"
            onChange={this.handleChange}>
          </textarea>
          {/* <button className={Style.ticketBtnBack}>Back</button> */}
          <button className={Style.ticketBtnNext}
            onClick={this.handleClick}>
            Next
          </button>
        </div>
      </div>
    );
  }
}

export default TrainTicket;
