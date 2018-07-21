import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import FaGitHubIcon from 'react-icons/lib/fa/github';
import FaLinkedIn from 'react-icons/lib/fa/linkedin-square';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Attendance from './Attendance';
import ProfileViewDialog from './ProfileViewDialog';

const styles = (theme) => ({
  root: {
    margin: theme.spacing.unit,
    width: 160,
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
  },
  filler: {
    flexGrow: 1,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    height: 104,
    width: 104,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
  },
  iconButton: {
    width: 24,
    height: 24,
  },
  button: {
    width: "50%",
    height: 20,
    borderRadius: 0,
    border: 0,

  },
  actionIcon: {
    width: 24,
    height: 24,
    cursor: 'pointer',
  },
  teacherPanel: {
    marginTop: theme.spacing.unit / 2,
    display: 'flex',
    justifyContent: 'center',
  },
});

@inject('currentModuleStore', 'currentUserStore')
@observer
class UserCard extends React.Component {

  state = {
    open: false,
  }

  handleRemove = () => {
    const { user } = this.props;
    const { id: moduleId } = this.props.currentModuleStore.currentModule;
    this.props.currentModuleStore.deleteTeacher(moduleId, user.id);
  };

  handleLinkedIn = () => {
    const { user } = this.props;
    window.open(`https://www.linkedin.com/in/${user.linkedin_username}`, '_blank');
  };

  handleGitHub = () => {
    const { user } = this.props;
    window.open(`http://github.com/${user.username}`, '_blank');
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleUpdate = async (profile) => {
    this.handleClose();
    await this.props.currentUserStore.updateCurrentUser(profile);
  }

  saveAttendance = (e) => {
    const { user, selectedWeek } = this.props;
    this.props.currentModuleStore.saveAttendance(user, selectedWeek, {
      ...user.history[selectedWeek],
      attendance: e.target.checked ? 1 : 0,
    });
  }

  saveHomework = (e) => {
    const { user, selectedWeek } = this.props;
    this.props.currentModuleStore.saveAttendance(user, selectedWeek, {
      ...user.history[selectedWeek],
      homework: e.target.checked ? 1 : 0,
    });
  }

  render() {
    const { classes, user, currentUserStore, selectedWeek, showAttendance, showRemoveTeacher } = this.props;

    return (
      <div className={classes.root}>
        <Card>
          <CardContent classes={{ root: classes.cardContent }}>
            <Avatar
              className={classes.avatar}
              src={`https://avatars.githubusercontent.com/${user.username}`}
              title={`Profile - ${user.username}`}
            />
            <Typography align='center' variant="body2" title={user.username} noWrap>
              {user.username}
            </Typography>
            <Typography align='center' variant="body1" noWrap>
              {user.full_name && user.full_name !== user.username ? user.full_name : '-'}
            </Typography>
            <Typography variant="caption">
              {user.role + (user.group_name ? ' / ' + user.group_name : '')}
            </Typography>
          </CardContent>
          <CardActions className={classes.actions}>
            <FaGitHubIcon className={classes.actionIcon} onClick={this.handleGitHub} />
            {user.linkedin_username != null &&
              <FaLinkedIn className={classes.actionIcon} onClick={this.handleLinkedIn} />}
            <span className={classes.filler} />
            {user.bio && <Tooltip title="View profile">
              <MoreHorizIcon className={classes.actionIcon} color="action" onClick={this.handleClickOpen} />
            </Tooltip>}
          </CardActions>
        </Card>
        {showRemoveTeacher && user.role === "teacher" && currentUserStore.isTeacher &&
          <Paper className={classes.teacherPanel}>
            <Button color="secondary" onClick={this.handleRemove}>
              Remove
            </Button>
          </Paper>}
        {showAttendance && <Attendance user={user} selectedWeek={selectedWeek} />}
        {user.bio && <ProfileViewDialog
          profile={user}
          open={this.state.open}
          onClose={this.handleClose}
          onUpdate={this.handleUpdate}
        />}
      </div>
    );
  }
}

UserCard.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentModuleStore: PropTypes.object.isRequired,
  currentUserStore: PropTypes.object.isRequired,
  selectedWeek: PropTypes.number.isRequired,
  showAttendance: PropTypes.bool,
  showRemoveTeacher: PropTypes.bool,
  user: PropTypes.object.isRequired,
};

UserCard.defaultProps = {
  showAttendance: false,
  showRemoveTeacher: false,
  selectedWeek: 0,
};

export default withStyles(styles)(UserCard);
