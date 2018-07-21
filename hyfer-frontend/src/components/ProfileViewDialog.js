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
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MarkdownViewer from './MarkdownViewer';

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
  },
  appBar: {
    position: 'relative',
  },
  content: {
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 2,
    backgroundColor: theme.palette.background.default,
  },
  flex: {
    flex: 1,
  },
  bioHeader: {
    margin: theme.spacing.unit * 4,
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ProfileViewDialog extends React.Component {

  onMarkdownChange = (bio) => this.setState({ bio });

  render() {
    const { classes, open, onClose, profile } = this.props;

    return (
      <div className={classes.root}>
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
                Biography for {profile.username}
              </Typography>
              <Button color="inherit" onClick={onClose}>
                Close
            </Button>
            </Toolbar>
          </AppBar>
          <DialogContent className={classes.content}>
            <Grid container justify="center" spacing={24}>
              <Grid item xs={12} sm={8} lg={6} xl={4}>
                <Paper elevation={2}>
                  <MarkdownViewer markdown={profile.bio || 'Not provided.'} />
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

ProfileViewDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  profile: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProfileViewDialog);
