/* eslint react/prop-types: error */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';

@inject('currentModuleStore')
@observer
export default class CurrentModuleDetails extends Component {
  render() {
    const { group, module, currentModule, students, teachers } = this.props.currentModuleStore;
    if (!currentModule) {
      return <h1>No module selected.</h1>;
    }

    return (
      <div>
        <h1>CurrentModuleStore Data</h1>
        <h2>Module:</h2>
        <pre>{JSON.stringify(module, null, 2)}</pre>
        <h2>Group:</h2>
        <pre>{JSON.stringify(group, null, 2)}</pre>
        <h2>Running Module:</h2>
        <pre>{JSON.stringify(currentModule, null, 2)}</pre>
        <h2>Students:</h2>
        <pre>{JSON.stringify(students, null, 2)}</pre>
        <h2>Teachers:</h2>
        <pre>{JSON.stringify(teachers, null, 2)}</pre>
      </div>
    );
  }
}

CurrentModuleDetails.wrappedComponent.propTypes = {
  currentModuleStore: PropTypes.object.isRequired,
};
