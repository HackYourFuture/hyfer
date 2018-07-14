import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class ProfileDialog extends React.Component {

  state = {
    email: '',
    linkedInName: '',
    isChanged: false,
  };

  componentDidMount() {
    const { email, linkedInName } = this.props;
    this.setState({ email, linkedInName });
  }

  onEmailChange = e => this.setState({
    email: e.target.value.trim(),
    isChanged: true,
  });

  onLinkedInNameChange = e => this.setState({
    linkedInName: e.target.value.trim(),
    isChanged: true,
  });

  onUpdate = () => {
    const { email, linkedInName } = this.state;
    this.props.onUpdate(email, linkedInName);
  }

  render() {
    const { open, onClose } = this.props;
    const { email, linkedInName } = this.state;

    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">UpdateProfile Details</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            value={email}
            onChange={this.onEmailChange}
            fullWidth
          />
          <TextField
            margin="dense"
            id="name"
            label="LinkedIn Username"
            type="text"
            value={linkedInName}
            onChange={this.onLinkedInNameChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={this.onUpdate}
            color="primary"
            disabled={!this.state.isChanged}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ProfileDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  email: PropTypes.string,
  linkedInName: PropTypes.string,
};
