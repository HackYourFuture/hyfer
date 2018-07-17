import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
// import CardMedia from '@material-ui/core/CardMedia';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import FaGitHub from 'react-icons/lib/fa/github';
import FaLinkedIn from 'react-icons/lib/fa/linkedin-square';
import CancelIcon from '@material-ui/icons/Cancel';
import ProfileDialog from './ProfileDialog';

const styles = (theme) => ({
  card: {
    width: 150,
    margin: 1,
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
  actionIcon: {
    width: 24,
    height: 24,
    cursor: 'pointer',
  },
});

@inject('currentModuleStore', 'currentUser')
@observer
class UserCard extends React.Component {

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

  render() {
    const { classes, user, showDeleteButton, currentUser } = this.props;

    return (
      <React.Fragment>
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
              gutter
              variant="body1"
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
              <React.Fragment>
                <span className={classes.filler} />
                <EditIcon className={classes.actionIcon} onClick={this.handleClickOpen} />
              </React.Fragment>}
          </CardActions>
        </Card>
        <ProfileDialog
          email={currentUser.email}
          linkedInName={currentUser.linkedInName}
          open={this.state.open}
          onClose={this.handleClose}
          onUpdate={this.handleUpdate}
        />
      </React.Fragment>
    );
  }
}

UserCard.propTypes = {
  classes: PropTypes.object.isRequired,
  currentModuleStore: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  showDeleteButton: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

UserCard.defaultProps = {
  showDeleteButton: false,
};

export default withStyles(styles)(UserCard);
