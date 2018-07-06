import React, { Component } from 'react';
import style from '../../../assets/styles/users.css';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import Moment from 'moment';

class User extends Component {
  render() {
    const { classes } = this.props;
    const { user } = this.props;
    return (
      <li className={style.userInformation}>
        <div>
          <div className={style.imageContainer}>
            <img
              className={style.userAvatar}
              src={`https://avatars.githubusercontent.com/${
                user.username
                }`}
              alt={`Profile - ${user.username}`}
              onError={e => {
                e.target.src = `https://api.adorable.io/avatars/100/${
                  user.full_name
                  }`;
              }}
            />
          </div>

          <div className={style.titleContainer}>
            <div
              className={user.register_date ? '' : styles.hidden}
            >
              {new Moment(user.register_date).format(
                'DD MMMM YYYY'
              )}
            </div>
            <div className={style.userName}>{user.full_name}</div>
            <div
              className={
                (user.role ? '' : style.hidden) + ' ' + style.role
              }
            >
              {user.role +
                (user.group_name ? ' / ' + user.group_name : '')}
            </div>
          </div>
        </div>

        <FormControlLabel
          control={
            <Checkbox
              // checked={this.state.checkedG}
              // onChange={this.handleChange('checkedG')}
              value="checkedG"
              classes={{
                root: classes.root,
                checked: classes.checked,

              }}
            />
          }
          label="present"
        />

      </li>
    );
  }
}
const styles = {
  root: {
    color: green[600],
    width: 80,
    height: 80,
    size: 40,
    '&$checked': {
      color: green[500],
    },
  },

};
User.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(User);
