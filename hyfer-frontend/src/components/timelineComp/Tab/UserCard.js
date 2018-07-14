import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FaGitHub from 'react-icons/lib/fa/github';
import FaLinkedIn from 'react-icons/lib/fa/linkedin';
import CancelIcon from '@material-ui/icons/Cancel';
import { inject, observer } from 'mobx-react';

const styles = {
  card: {
    maxWidth: 350,
    minWidth: 250,
    margin: 2,
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
};

@inject("currentModuleStore", "global")
@observer
class UserCard extends React.Component {

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

  render() {
    const { classes } = this.props;
    const { user } = this.props;
    console.log(this.props.currentModuleStore.currentModuleTest);
    return (
      <div>
        <Card className={classes.card}>
          <CardHeader
            action={user.role === "teacher" && this.props.global.isTeacher &&
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
              variant="headline"
              component="h1">
              {user.username}
            </Typography>
            <Typography variant="caption" gutterBottom align="center">
              {user.role + (user.group_name ? ' / ' + user.group_name : '')}
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton onClick={this.handleGitHub}>
              <FaGitHub className={classes.iconButton} />
            </IconButton>
            {user.linkedin_username != null &&
              <IconButton onClick={this.handleLinkedIn}>
                <FaLinkedIn className={classes.iconButton} />
              </IconButton>}
          </CardActions>
        </Card>
      </div >
    );
  }
}
UserCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserCard);
