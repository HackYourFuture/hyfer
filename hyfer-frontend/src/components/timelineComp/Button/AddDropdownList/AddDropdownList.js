import React, { Component } from 'react';
import Dropdown from '../../../../Helpers/Dropdown/Dropdown';
import classes from './addDropdownList.css';
import AddClassModal from './AddClassModal/AddClassModal';

export default class AddDropdownList extends Component {
  state = {
    classModalIsToggled: false,
  };

  toggleClassModal = () => {
    this.setState({ classModalIsToggled: true });
  };

  closeClassModal = () => {
    this.setState({ classModalIsToggled: false });
  };

  render() {
    return (
      <div>
        <Dropdown
          isToggled={this.props.isToggled}
          className={classes.dropdownWrapper}
        >
          <div>
            <ul>
              <li className={classes.listItem} onClick={this.toggleClassModal}>
                <span>Add a new class</span>
              </li>
            </ul>
          </div>
        </Dropdown>
        <AddClassModal
          isToggled={this.state.classModalIsToggled}
          closeModal={this.closeClassModal}
        />
      </div>
    );
  }
}
