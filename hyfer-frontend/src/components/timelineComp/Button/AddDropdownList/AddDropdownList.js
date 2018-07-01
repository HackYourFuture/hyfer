import React, { Component } from 'react';
import Dropdown from '../../../../Helpers/Dropdown/Dropdown';
import classes from './addDropdownList.css';
import AddClassModal from './AddClassModal/AddClassModal';
import AddNewModuleModal from './AddNewModuleModal/AddNewModuleModal';

// TODO: check if this component is used somewhere

export default class AddDropdownList extends Component {
  state = {
    classModalIsToggled: false,
    newModuleModalIsToggled: false,
  };

  toggleClassModal = () => {
    this.setState({ classModalIsToggled: true });
  };

  closeClassModal = () => {
    this.setState({ classModalIsToggled: false });
  };

  toggleNewModuleModal = () => {
    this.setState({ newModuleModalIsToggled: true });
  };

  closeNewModuleModal = () => {
    this.setState({ newModuleModalIsToggled: false });
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
              <li
                className={classes.listItem}
                onClick={this.toggleNewModuleModal}
              >
                <span>Add a new module</span>
              </li>
            </ul>
          </div>
        </Dropdown>
        <AddClassModal
          isToggled={this.state.classModalIsToggled}
          closeModal={this.closeClassModal}
        />
        <AddNewModuleModal
          groupsWithIds={this.props.groupsWithIds}
          items={this.props.items}
          modules={this.props.modules}
          groups={this.props.groups}
          isToggled={this.state.newModuleModalIsToggled}
          closeModal={this.closeNewModuleModal}
        />
      </div>
    );
  }
}
