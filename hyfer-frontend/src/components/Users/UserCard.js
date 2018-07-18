import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import FaGitHub from 'react-icons/lib/fa/github';
import FaLinkedIn from 'react-icons/lib/fa/linkedin';
import CancelIcon from '@material-ui/icons/Cancel';
import ProfileDialog from './ProfileDialog';
// import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// import Button from '@material-ui/core/Button';
const styles = {

  card: {
    margin: 2,
    width: 250,
  },
  actions: {
    display: 'flex',
  },
  filler: {
    flexGrow: 1,
  },
  media: {
    // paddingTop: '40.25%', // 16:9
    borderRadius: '50%',
    marginTop: 7,
    minHeight: 150,
    maxHeight: 200,
    backgroundSize: 'contain',
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


};

@inject('currentModuleStore', 'global')
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
    await this.props.global.updateCurrentUser(email, linkedInName);
    this.props.currentModuleStore.getRunningModuleDetails(id);
  }

  saveAttendance = (user_id, week_num, attendance, homework) => {
    const present = attendance === 0 ? 1 : 0;
    this.props.currentModuleStore.saveAttendance(user_id, week_num, present, homework);
  }

  saveHomework = (user_id, week_num, attendance, homework) => {
    const homeworkCheked = homework === 0 ? 1 : 0;
    this.props.currentModuleStore.saveAttendance(user_id, week_num, attendance, homeworkCheked);
  }
  render() {
    const { classes, user, showDeleteButton, selectedWeek } = this.props;
    const { currentUser } = this.props.global;
    const { module } = this.props.currentModuleStore;
    return (
      <React.Fragment>
        <Card className={classes.card}>
          {user.role === "student" && module.module_name !== "Holiday" && this.props.global.isTeacher && selectedWeek >= 0 ?
            <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
              <FormControlLabel
                style={{ marginLeft: 10 }}
                control={
                  <Checkbox
                    checked={user.history.attendance[selectedWeek] === 0 ? false : true}
                    onChange={() => this.saveAttendance(user.id, selectedWeek, user.history.attendance[selectedWeek], user.history.homework[selectedWeek])}
                    value="present"
                  />
                }
                label="present"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={user.history.homework[selectedWeek] === 0 ? false : true}
                    onChange={() => this.saveHomework(user.id, selectedWeek, user.history.attendance[selectedWeek], user.history.homework[selectedWeek])}
                    value="homework"
                  />
                }
                label="homework"
              />
            </div>
            : ""}
          <CardHeader
            action={showDeleteButton && user.role === "teacher" && this.props.global.isTeacher &&
              <IconButton color="secondary" onClick={this.handleDelete}>
                <CancelIcon className={classes.iconButton} />
              </IconButton>}>
          </CardHeader>

          <CardMedia
            className={classes.media}
            image={`https://avatars.githubusercontent.com/${user.username}`}
            title={`Profile - ${user.username}`}
          />
          <CardContent>
            <Typography
              align='center'
              gutterBottom
              variant="subheading"
              component="h5">
              {user.username}
            </Typography>
            <Typography variant="body1" gutterBottom align="center">
              {user.role + (user.group_name ? ' / ' + user.group_name : '')}
            </Typography>
          </CardContent>
          <CardActions className={classes.actions}>
            <IconButton onClick={this.handleGitHub}>
              <FaGitHub className={classes.iconButton} />
            </IconButton>
            {user.linkedin_username != null &&
              <IconButton onClick={this.handleLinkedIn}>
                <FaLinkedIn className={classes.iconButton} />
              </IconButton>}
            {user.id === this.props.global.currentUser.id &&
              <React.Fragment>
                <span className={classes.filler} />
                <IconButton onClick={this.handleClickOpen}>
                  <EditIcon className={classes.iconButton} />
                </IconButton>

              </React.Fragment>}
          </CardActions>

        </Card>
        <ProfileDialog
          email={currentUser.email}
          linkedInName={currentUser.linkedin_username}
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
  showDeleteButton: PropTypes.bool.isRequired,
};

UserCard.defaultProps = {
  showDeleteButton: false,
};

export default withStyles(styles)(UserCard);
