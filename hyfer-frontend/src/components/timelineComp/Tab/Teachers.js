import React from 'react';
import UsersCard from './UsersCard';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    position: "absolute",
    right: 0,
    bottom: 0,
    cursor: "pointer",
  },
});

@inject('currentModuleStore')
@observer
class Teachers extends React.Component {
  handleClick = () => {
    // import dilog  and  you can get the running Module id from the currentModuleStore  
    console.log("test");
  }
  render() {
    const { teachers } = this.props.currentModuleStore;
    const { classes } = this.props;
    return (
      <div style={{ maxWidth: "100%", maxHeight: "100%", display: "flex", flexWrap: "wrap" }}>
        {teachers.map(user => {
          return (
            <UsersCard key={user.id} user={user} />
          );
        })}
        <Button onClick={() => { this.handleClick(); }} variant="fab" mini color="white" aria-label="add" className={classes.button}>
          <AddIcon />
        </Button>
      </div>

    );

  }
}
Teachers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Teachers);
