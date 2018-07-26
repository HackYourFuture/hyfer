import PropTypes from 'prop-types';
import React from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import grey from '@material-ui/core/colors/grey';
import TimelineMenu from './TimelineMenu';
import classNames from 'classnames';

const styles = (theme) => ({
  root: {
    padding: theme.spacing.unit / 2,
  },
  container: {
    // margin: halfUnit,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    cursor: 'pointer',
    boxSizing: 'border-box',
    border: `solid 4px transparent`,
  },
  selected: {
    border: `dashed 4px ${grey[700]}`,
    color: 'green',
  },
  moduleName: {
    color: 'white',
    marginLeft: theme.spacing.unit * 2,
  },
  menuButton: {
    opacity: 0.25,
    '&:hover': {
      opacity: 1,
    },
    [`@media(max-width: ${theme.breakpoints.values.sm}px)`]: {
      opacity: 1,
    },
  },
});

@inject('currentModule', 'currentUser', 'users', 'timeline')
@observer
class TimelineModule extends React.Component {
  state = {
    anchorEl: null,
  };

  openMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  closeMenu = () => {
    this.setState({ anchorEl: null });
  };

  itemClickHandler = (item) => {
    if (this.props.currentUser.isStudentOrTeacher) {
      this.props.currentModule.getRunningModuleDetails(item);
    }
  };

  render() {
    const {
      module_name,
      duration,
      color,
      archived,
      running_module_id,
    } = this.props.item;

    // Add extra times width as much as needed but for the margin add all - 1 
    // (for the first item it doesn't need any margin)
    const { spacing } = this.props.theme;
    const { itemWidth, rowHeight } = this.props.timeline;
    const width = itemWidth * duration - spacing.unit;

    const { classes, currentUser } = this.props;
    const { selectedModule } = this.props.currentModule;
    const selected = selectedModule && selectedModule.running_module_id === running_module_id;

    return (
      <div className={classes.root}>
        <Paper elevation={2}
          className={classNames(classes.container, selected ? classes.selected : '')}
          style={{ width, height: rowHeight, backgroundColor: color }}
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
          {currentUser.isTeacher && archived === 0 && (
            <React.Fragment>
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
            </React.Fragment>
          )}
        </Paper >
      </div>
    );
  }
}

TimelineModule.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentModule: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  isLast: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  timeline: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(TimelineModule);
