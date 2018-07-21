import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MarkdownEditor from './MarkdownEditor';

const styles = (theme) => ({
  appBar: {
    position: 'relative',
  },
  content: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  flex: {
    flex: 1,
  },
  bioHeader: {
    marginTop: theme.spacing.unit * 2,
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ProfileEditDialog extends React.Component {
  state = {
    email: '',
    linkedInName: '',
    notes: '',
    isChanged: false,
  };

  componentDidMount() {
    const { email, linkedin_username: linkedInName, notes } = this.props.profile;
    this.setState({ email, linkedInName, notes });
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
    const { email, linkedInName, notes } = this.state;
    this.props.onUpdate({ email, linkedInName, notes });
  }

  onMarkdownChange = (notes) => this.setState({ notes });

  render() {
    const { classes, open, onClose } = this.props;
    const { email, linkedInName } = this.state;

    return (
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
        <DialogContent className={classes.content}>
          <Grid container justify="center" spacing={24}>
            <Grid item xs={12} sm={8} lg={6} xl={4}>
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
              <Typography variant="caption" color="textSecondary" className={classes.bioHeader} gutterBottom>
                Notes:
                </Typography>
              <MarkdownEditor
                markdown={this.state.notes || ''}
                onChange={this.onMarkdownChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
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
