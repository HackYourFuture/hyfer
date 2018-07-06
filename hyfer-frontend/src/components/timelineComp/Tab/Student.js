import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Slider } from '@material-ui/lab/Slider';

const styles = {
  root: {
    width: 300,
  },
};

class Student extends React.Component {
  state = {
    value: 3,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <Slider value={value} min={0} max={6} step={1} onChange={this.handleChange} />
      </div>
    );
  }
}

Student.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Student);
