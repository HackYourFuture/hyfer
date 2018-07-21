import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MarkdownEditorBase from './MarkdownEditorBase';

const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

@observer
class ProfileEditDialog extends React.Component {
  state = {
    email: '',
    linkedInName: '',
    bio: '',
    isChanged: false,
  };

  componentDidMount() {
    const { email, linkedin_username: linkedInName, bio } = this.props.profile;
    this.setState({ email, linkedInName, bio });
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
    const { email, linkedInName, bio } = this.state;
    this.props.onUpdate({ email, linkedInName, bio });
  }

  onMarkdownChange = (bio) => this.setState({ bio });

  render() {
    const { classes, open, onClose } = this.props;
    const { email, linkedInName } = this.state;

    return (
      <div>
        <Dialog
          fullScreen
          open={open}
          onClose={onClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={onClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.flex}>
                Edit profile
              </Typography>
              <Button color="inherit" onClick={this.onUpdate}>
                Save
              </Button>
            </Toolbar>
          </AppBar>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email address"
              type="email"
              value={email}
              onChange={this.onEmailChange}
              fullWidth
            />
            <TextField
              margin="dense"
              id="name"
              label="LinkedIn username"
              type="text"
              value={linkedInName}
              onChange={this.onLinkedInNameChange}
              fullWidth
            />
            <Typography variant="subheading" color="inherit">
              Bio
            </Typography>
            <MarkdownEditorBase
              markdown={this.state.bio}
              onChange={this.onMarkdownChange}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

ProfileEditDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  profile: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProfileEditDialog);
