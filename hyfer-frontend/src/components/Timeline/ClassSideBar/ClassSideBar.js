/* eslint react/prop-types: error */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import ClassSelector from './ClassSelector';
import ClassButton from './ClassButton';

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    borderRight: `1px solid ${grey[500]}`,
    width: 150,
    zIndex: 4,
    background: grey[50],
  },
});

@inject('currentUser', 'timeline')
@observer
class ClassSideBar extends Component {

  renderButtons = () => {
    const { timeline, currentUser } = this.props;
    return timeline.groups.map(group => (
      <ClassButton
        key={group}
        classId={group.replace(/ /g, '').substr(5)}
        height={this.props.rowHeight}
        disabled={!currentUser.isTeacher}
      />
    ));
  };

  render() {
    const { classes, myRef } = this.props;
    return (
      <div
        className={classes.container}
        ref={myRef}
      >
        <ClassSelector />
        {this.renderButtons()}
      </div>
    );
  }
}

ClassSideBar.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  myRef: PropTypes.object.isRequired,
  rowHeight: PropTypes.number.isRequired,
  timeline: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClassSideBar);
