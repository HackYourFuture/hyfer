import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import grey from '@material-ui/core/colors/grey';
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
    borderRight: `1px solid ${grey[500]}`,
    // width: 160,
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

  state = {
    anchorEl: null,
  }

  handleClassButtonClick = (e) => {
    this.setState({ anchorEl: e.target });
  }

  onCloseOptionsMenu = () => {
    this.setState({ anchorEl: null });
  };

  renderButtons = () => {
    return this.props.timelineStore.selectedGroups.map((group) => (
      <React.Fragment key={group.group_name}>
        <ClassButton
          group={group}
          height={this.props.timelineStore.rowHeight}
          disabled={!this.props.currentUserStore.isTeacher}
          onClick={this.handleClassButtonClick}
        />
        <ClassOptionsMenu
          anchorEl={this.state.anchorEl}
          onClose={this.onCloseOptionsMenu}
          group={group}
        />
      </React.Fragment>
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

        <ClassSelectMenu />
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
  timelineStore: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClassSideBar);
