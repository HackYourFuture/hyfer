import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
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

@inject('currentModule', 'currentUser')
@observer
class UserCard extends React.Component {

  state = {
    open: false,
  }

  handleRemove = () => {
    const { user } = this.props;
    const { running_module_id: runningId } = this.props.currentModule.selectedModule;
    this.props.currentModule.deleteTeacher(runningId, user.id);
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
    await this.props.currentUser.updateCurrentUser(profile);
  }

  saveAttendance = (e) => {
    const { user, selectedWeek } = this.props;
    this.props.currentModule.saveAttendance(user, selectedWeek, {
      ...user.history[selectedWeek],
      attendance: e.target.checked ? 1 : 0,
    });
  }

  saveHomework = (e) => {
    const { user, selectedWeek } = this.props;
    this.props.currentModule.saveAttendance(user, selectedWeek, {
      ...user.history[selectedWeek],
      homework: e.target.checked ? 1 : 0,
    });
  }

  render() {
    const { classes, user, currentUser, selectedWeek, showAttendance, showRemoveTeacher } = this.props;

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
            <Icon
              className={classNames(classes.actionIcon, 'fab fa-github')}
              color="action"
              onClick={this.handleGitHub} />
            {user.linkedin_username != null &&
              <Icon
                className={classNames(classes.actionIcon, 'fab fa-linkedin')}
                color="action"
                onClick={this.handleLinkedIn} />}
            {user.notes &&
              <React.Fragment>
                <span className={classes.filler} />
                <Icon
                  className={classNames(classes.actionIcon, 'far fa-clipboard')}
                  color="action"
                  onClick={this.handleClickOpen} />
              </React.Fragment>}
          </CardActions>
        </Card>
        {showRemoveTeacher && user.role === "teacher" && currentUser.isTeacher &&
          <Paper className={classes.teacherPanel}>
            <Button color="secondary" onClick={this.handleRemove}>
              Remove
            </Button>
          </Paper>}
        {showAttendance && <Attendance user={user} selectedWeek={selectedWeek} />}
        {user.notes && <ProfileViewDialog
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
  currentModule: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
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
