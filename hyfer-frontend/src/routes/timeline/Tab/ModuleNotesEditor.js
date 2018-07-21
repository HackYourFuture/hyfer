import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import MarkdownEditor from '../../../components/MarkdownEditor';

const styles = (theme) => ({
  editor: {
    paddingTop: theme.spacing.unit,
  },
  toolbarContainer: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

class ModuleNotesEditor extends Component {

  state = {
    markdown: '',
  };

  handleValueChange = (markdown) => {
    this.setState({ markdown });
  }

  handleSaveClick = () => this.props.onSave(this.state.markdown);

  render() {
    const { classes, markdown } = this.props;

    return (
      <React.Fragment>
        <div className={classes.editor}>
          <MarkdownEditor
            markdown={markdown}
            onChange={this.handleValueChange} />
        </div>
        <Paper className={classes.toolbarContainer}>
          <Toolbar className={classes.toolbar} variant="dense" disableGutters>
            <Button color="secondary" className={classes.button} onClick={this.props.onCancel}>
              Cancel
            </Button>
            <Button color="primary" className={classes.button} onClick={this.handleSaveClick}>
              Save
            </Button>
          </Toolbar>
        </Paper>
      </React.Fragment>
    );
  }
}

ModuleNotesEditor.propTypes = {
  classes: PropTypes.object.isRequired,
  markdown: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

ModuleNotesEditor.defaultProps = {
  onChange: () => undefined,
};

export default withStyles(styles)(ModuleNotesEditor);
