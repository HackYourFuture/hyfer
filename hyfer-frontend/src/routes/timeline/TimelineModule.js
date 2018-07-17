import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import TimelineMenu from './TimelineMenu';

const styles = (theme) => {
  const full = theme.spacing.unit;
  const half = full / 2;
  const double = full * 2;
  return {
    container: {
      margin: half,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      cursor: 'pointer',
    },
    moduleName: {
      color: 'white',
      marginLeft: double,
    },
    menuButton: {
      opacity: 0,
      '&:hover': {
        opacity: 1,
      },
      [`@media(max-width: ${theme.breakpoints.values.sm}px)`]: {
        opacity: 1,
      },
    },
  };
};

@inject('currentModuleStore', 'currentUser', 'userStore')
@observer
class TimelineModule extends Component {
  state = {
    anchorEl: null,
  };

  openMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  closeMenu = () => {
    this.setState({ anchorEl: null });
  };

  itemClickHandler = (item) => {
    const { isStudent, isTeacher } = this.props.currentUser;
    if (isStudent || isTeacher) {
      this.props.currentModuleStore.getRunningModuleDetails(item.running_module_id);
    }
  };

  render() {
    const {
      module_name,
      duration,
      color,
      running_module_id,
    } = this.props.item;

    // Add extra times width as much as needed but for the margin add all - 1 
    // (for the first item it doesn't need any margin)
    const { spacing } = this.props.theme;
    const width = this.props.width * duration + spacing.unit * (duration - 1);

    const { classes } = this.props;

    return (
      <Paper elevation={1}
        className={classes.container}
        style={{ width, height: this.props.height, backgroundColor: color }}
        onClick={() => this.itemClickHandler(this.props.item)}
      >
        <Typography
          variant="subheading"
          title={module_name}
          className={classes.moduleName}
          noWrap
        >
          {module_name}
        </Typography>
        <IconButton
          onClick={this.openMenu}
          className={classes.menuButton}
        >
          <MoreVertIcon color="action" />
        </IconButton>
        <TimelineMenu
          runningModuleId={running_module_id}
          anchorEl={this.state.anchorEl}
          onClose={this.closeMenu}
        />
      </Paper >
    );
  }
}

TimelineModule.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentModuleStore: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  isLast: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  userStore: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
};

export default withStyles(styles, { withTheme: true })(TimelineModule);
