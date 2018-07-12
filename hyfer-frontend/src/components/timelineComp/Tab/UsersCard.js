import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import FaGithub from 'react-icons/lib/fa/github';
import Falinkedin from 'react-icons/lib/fa/linkedin';

const styles = {
  card: {
    maxWidth: 350,
    minWidth: 250,
    marginTop: 5,
    marginLeft: 0,
    marginRight: 0,
  },
  media: {
    // paddingTop: '40.25%', // 16:9
    borderRadius: '50%',
    marginTop: 7,
    minHeight: 150,
    maxHeight: 200,
    backgroundSize: 'contain',
  },
};

class UsersCard extends React.Component {
  render() {
    const { classes } = this.props;
    const { user } = this.props;
    console.log(user.linkedin_username);
    console.log(user.username);

    return (
      <div>
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image={`https://avatars.githubusercontent.com/${
              user.username
              }`}
            title={`Profile - ${user.username}`}
          />
          <CardContent>
            <Typography align='center' gutterBottom variant="headline" component="h1">
              {user.username}
            </Typography>
            <Typography variant="caption" gutterBottom align="center">
              {user.role +
                (user.group_name ? ' / ' + user.group_name : '')}
            </Typography>
          </CardContent>
          <CardContent >
            {user.linkedin_username !== null ?
              <a
                href={'https://www.linkedin.com/in/' + user.linkedin_username}
                target="_blank"
              >
                <Falinkedin style={{ width: 30, height: 30, cursor: "pointer", margin: " auto 60px" }} />
              </a>
              : ""}
            <a
              href={'http://github.com/' + user.username}
              target="_blank"
            >
              <FaGithub style={{ width: 30, height: 30, cursor: "pointer" }} />
            </a>
          </CardContent>
        </Card>
      </div >
    );
  }
}
UsersCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UsersCard);
