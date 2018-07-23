import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const styles = (theme) => ({
  root: {
    padding: theme.spacing.unit / 2,
  },
});

@inject('timelineStore')
@observer
class EmptyWeekModule extends Component {

  render() {
    const { classes, theme } = this.props;
    const { itemWidth, rowHeight } = this.props.timelineStore;
    return (
      <div className={classes.root}>
        <Paper elevation={1} style={{ width: itemWidth - theme.spacing.unit, height: rowHeight }} />
      </div>
    );
  }
}

EmptyWeekModule.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  timelineStore: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(EmptyWeekModule);
