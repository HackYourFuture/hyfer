import React from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ClassSelectMenu from './ClassSelectMenu';
import ClassButton from './ClassButton';
import ClassOptionsMenu from './ClassOptionsMenu';

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.unit * 2 - 2,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    borderRight: `1px solid ${theme.palette.grey[500]}`,
  },
  button: {
    marginRight: theme.spacing.unit,
  },
});

@inject('currentUser', 'timeline')
@observer
class ClassSideBar extends React.Component {

  state = {
    anchorEl: null,
    group: null,
  }

  handleClassButtonClick = (e, group) => {
    this.setState({ anchorEl: e.target, group });
  }

  onCloseOptionsMenu = () => {
    this.setState({ anchorEl: null });
  };

  renderButtons = () => {
    return this.props.timeline.selectedGroups.map((group) => (
      <ClassButton
        key={group.group_name}
        group={group}
        height={this.props.timeline.rowHeight}
        disabled={!this.props.currentUser.isTeacher}
        onClick={this.handleClassButtonClick}
      />
    ));
  };

  render() {
    const { classes, sideBarRef, onTodayClick } = this.props;
    const { group, anchorEl } = this.state;
    return (
      <div
        className={classes.container}
        ref={sideBarRef}
      >
        <Button
          className={classes.button}
          onClick={onTodayClick}
          color="secondary"
          title="Go to today">
          Today
        </Button>

        <ClassSelectMenu />
        {this.renderButtons()}
        {group && (
          <ClassOptionsMenu
            anchorEl={anchorEl}
            onCloseMenu={this.onCloseOptionsMenu}
            group={group}
          />
        )}

      </div>
    );
  }
}

ClassSideBar.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  sideBarRef: PropTypes.object.isRequired,
  onTodayClick: PropTypes.func.isRequired,
  timeline: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClassSideBar);
