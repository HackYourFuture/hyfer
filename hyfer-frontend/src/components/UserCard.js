import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import Avatar from '@material-ui/core/Avatar';
import CancelIcon from '@material-ui/icons/Cancel';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';
import FaGitHub from 'react-icons/lib/fa/github';
import FaLinkedIn from 'react-icons/lib/fa/linkedin-square';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Attendance from './Attendance';
import ProfileDialog from './ProfileDialog';

const styles = (theme) => ({
  card: {
    width: 180,
    margin: theme.spacing.unit / 2,
  },
  actions: {
    display: 'flex',
  },
  filler: {
    flexGrow: 1,
  },
  avatar: {
    height: 104,
    width: 104,
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
  attendance: {
    marginLeft: theme.spacing.unit,
  },
});

@inject('currentModuleStore', 'currentUser')
@observer
class UserCard extends Component {

  state = {
    open: false,
  }

  handleDelete = () => {
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

  handleUpdate = async (email, linkedInName) => {
    this.handleClose();
    const { id } = this.props.currentModuleStore.currentModule;
    await this.props.currentUser.updateCurrentUser(email, linkedInName);
    this.props.currentModuleStore.getRunningModuleDetails(id);
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
    const { classes, user, showDeleteButton, currentUser, selectedWeek, showAttendance } = this.props;

    return (
      <Fragment>
        <Card className={classes.card} square elevation={1}>
          {showDeleteButton && user.role === "teacher" && currentUser.isTeacher && <CardHeader
            action={
              <IconButton color="secondary" onClick={this.handleDelete}>
                <CancelIcon className={classes.iconButton} />
              </IconButton>}>
          </CardHeader>}
          <CardContent>
            <Avatar
              className={classes.avatar}
              src={`https://avatars.githubusercontent.com/${user.username}`}
              title={`Profile - ${user.username}`}
            />
            <Typography
              align='center'
              variant="body1"
              title={user.username}
              noWrap
            >
              {user.username}
            </Typography>
            <Typography variant="caption" gutterBottom align="center">
              {user.role + (user.group_name ? ' / ' + user.group_name : '')}
            </Typography>
          </CardContent>
          <CardActions className={classes.actions}>
            <FaGitHub className={classes.actionIcon} onClick={this.handleGitHub} />
            {user.linkedin_username != null &&
              <FaLinkedIn className={classes.actionIcon} onClick={this.handleLinkedIn} />}
            {user.id === currentUser.id &&
              <Fragment>
                <span className={classes.filler} />
                <EditIcon className={classes.actionIcon} onClick={this.handleClickOpen} />
              </Fragment>}
          </CardActions>
          {showAttendance &&
            <Fragment>
              <Divider />
              <div className={classes.attendance} >
                <Attendance user={user} selectedWeek={selectedWeek} />
              </div>
            </Fragment>
          }
        </Card>
        <ProfileDialog
          email={currentUser.email}
          linkedInName={currentUser.linkedInName}
          open={this.state.open}
          onClose={this.handleClose}
          onUpdate={this.handleUpdate}
        />
      </Fragment>
    );
  }
}

UserCard.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentModuleStore: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  selectedWeek: PropTypes.number.isRequired,
  showAttendance: PropTypes.bool,
  showDeleteButton: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

UserCard.defaultProps = {
  showDeleteButton: false,
  selectedWeek: 0,
};

export default withStyles(styles)(UserCard);
