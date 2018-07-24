import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SundayPicker from './SundayPicker';

const styles = (theme) => ({
  sundayPicker: {
    marginTop: theme.spacing.unit,
  },
});

@inject('timelineStore')
@observer
class AddClassDialog extends React.Component {
  state = {
    open: false,
    selectedDate: null,
  };

  sundays = [];
  nextClassNumber = 0;

  handleAddClass = () => {
    const { selectedDate } = this.state;
    this.props.onAddClass({ classNumber: this.nextClassNumber, startingDate: selectedDate });
  };

  handleChange = (selectedDate) => {
    this.setState({ selectedDate });
  };

  componentDidMount() {
    const { groups } = this.props.timelineStore;
    const classNumbers = groups.map(group => +(group.group_name.match(/\d+/)[0]));
    this.nextClassNumber = Math.max(...classNumbers) + 1;
  }

  render() {
    // console.log(this.props);
    const { classes } = this.props;
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add class {this.nextClassNumber}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select a starting Sunday for the new class.
            </DialogContentText>
          <div className={classes.sundayPicker}>
            <SundayPicker onChange={this.handleChange} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary">
            Cancel
            </Button>
          <Button onClick={this.handleAddClass} color="primary">
            Add class
            </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

AddClassDialog.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  onAddClass: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  timelineStore: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddClassDialog);
