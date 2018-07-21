import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import grey from '@material-ui/core/colors/grey';
import ClassSelector from './ClassSelector';
import ClassButton from './ClassButton';

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    borderRight: `1px solid ${grey[500]}`,
    width: 150,
    zIndex: 4,
    background: grey[50],
  },
  button: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

@inject('currentUserStore', 'timelineStore')
@observer
class ClassSideBar extends Component {

  renderButtons = () => {
    const { timelineStore, currentUserStore } = this.props;
    return timelineStore.groups.map(group => (
      <ClassButton
        key={group}
        classId={group.replace(/ /g, '').substr(5)}
        height={this.props.rowHeight}
        disabled={!currentUserStore.isTeacher}
      />
    ));
  };

  render() {
    const { classes, myRef, onClick } = this.props;
    return (
      <div
        className={classes.container}
        ref={myRef}
      >
        <Button
          className={classes.button}
          onClick={onClick}
          color="secondary"
          title="Go to today">
          Today
        </Button>

        <ClassSelector />
        {this.renderButtons()}
      </div>
    );
  }
}

ClassSideBar.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentUserStore: PropTypes.object.isRequired,
  myRef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  rowHeight: PropTypes.number.isRequired,
  timelineStore: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClassSideBar);
