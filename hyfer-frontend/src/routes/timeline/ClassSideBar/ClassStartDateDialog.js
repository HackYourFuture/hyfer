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

@inject('timeline')
@observer
class ClassStartDateDialog extends React.Component {
  state = {
    open: false,
    selectedDate: null,
  };

  sundays = [];

  handleSave = () => {
    this.props.onClose();
    const { selectedDate } = this.state;
    const { classNumber } = this.props;
    this.props.onSave({ startingDate: selectedDate, classNumber });
  };

  handleChange = (selectedDate) => {
    this.setState({ selectedDate });
  };

  render() {
    // console.log(this.props);
    const { classes, open, onClose, startDate, title, classNumber, prompt } = this.props;
    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{title} {classNumber}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {prompt}
          </DialogContentText>
          <div className={classes.sundayPicker}>
            <SundayPicker startDate={startDate} onChange={this.handleChange} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary">
            Cancel
            </Button>
          <Button onClick={this.handleSave} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ClassStartDateDialog.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  classNumber: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  prompt: PropTypes.string.isRequired,
  startDate: PropTypes.object,
  timeline: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};

export default withStyles(styles)(ClassStartDateDialog);
