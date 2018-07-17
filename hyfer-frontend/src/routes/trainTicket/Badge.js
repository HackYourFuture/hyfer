/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import CardGiftcard from '@material-ui/icons/CardGiftcard';
import AddShoppingCart from '@material-ui/icons/AddShoppingCart';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit * 2,
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`,
  },
});

function SimpleBadge(props) {
  const { classes, couponCodes, reservedTickets } = props;
  return (
    <div>
      <div>
        <Badge
          className={classes.margin}
          badgeContent={couponCodes.length}
          color="primary"
        >
          <CardGiftcard />
        </Badge>
        <Badge
          className={classes.margin}
          badgeContent={reservedTickets.length}
          color="secondary"
        >
          <AddShoppingCart />
        </Badge>
      </div>
    </div>
  );
}

SimpleBadge.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleBadge);
