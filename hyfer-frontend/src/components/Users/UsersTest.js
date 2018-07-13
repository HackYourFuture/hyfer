import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FaGitHub from 'react-icons/lib/fa/github';
import FaLinkedIn from 'react-icons/lib/fa/linkedin';
import Button from '@material-ui/core/Button';
import { inject, observer } from 'mobx-react';

const styles = {
  card: {
    maxWidth: 350,
    minWidth: 250,
    margin: 2,
  },
  media: {
    borderRadius: '50%',
    marginTop: 7,
    minHeight: 150,
    maxHeight: 200,
    backgroundSize: 'contain',
  },

};

@inject('userStore')
@observer
class UserCard extends React.Component {

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
    return (
      <div>
        <Card className={classes.card}>
          <CardActions>
            <form
              onClick={() => this.props.userStore.getUserProfileInfo(user)}
            >
              <Link to="/profile">
                <Button variant="outlined" size="small" color="white" >
                  Edit
              </Button>
              </Link>
            </form>
          </CardActions>
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
