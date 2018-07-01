import React, { Component } from 'react';

export default class Dropdown extends Component {
  render() {
    let content = null;
    if (this.props.isToggled) {
      content = this.props.children;
    }
    return <div className={this.props.className}>{content}</div>;
  }
}
