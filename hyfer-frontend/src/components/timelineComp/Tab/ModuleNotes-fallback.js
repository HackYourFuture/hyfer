import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autorun } from 'mobx';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import marked from 'marked';

const noNotes = '_There are no notes for this module._';

const template =
  `## YouTube Lecture Recordings

(Right-click to open in a new tab.)

<!--
  Complete the link for the videos below. 
  Markdown format: [Part x](url)
--> 

### Week 1

- Part 1 - not (yet) available
- Part 2 - not (yet) available

### Week 2

- Part 1 - not (yet) available
- Part 2 - not (yet) available

### Week 3

- Part 1 - not (yet) available
- Part 2 - not (yet) available`;

const styles = theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  root: {
    width: 700,
    paddingLeft: 16,
    paddingRight: 16,
  },
  button: {
    margin: theme.spacing.unit,
    '&:firstChild': {
      marginLeft: 0,
    },
  },
  textArea: {
    minHeight: 480,
    fontSize: 14,
    border: '1px solid #ccc',
    borderRadius: 4,
    padding: 8,
    width: '100%',
    resize: 'none',
    ...theme.typography.body1,
  },
  article: {
    textAlign: 'left',
    width: '100%',
    ...theme.mixins.gutters(),
    ...theme.typography.body1,
  },
  bottomButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

const defaultState = {
  isEditing: false,
  isDirty: false,
  hasNotes: false,
  notes: '',
};

@inject('global', 'currentModuleStore')
@observer
class ModuleNotes extends Component {
  state = { ...defaultState };
  origNotes = '';

  componentDidMount() {
    this.disposeAutoRun = autorun(() => {
      const { currentModule } = this.props.currentModuleStore;
      const notes = currentModule && currentModule.notes;
      this.origNotes = notes;
      this.setState({ ...defaultState, notes });
    });
  }

  componentWillUnmount() {
    this.disposeAutoRun();
  }

  onChange = (e) => this.setState({
    notes: e.target.value,
    isDirty: true,
  });

  setEditMode = () => {
    let { notes } = this.state;
    if (!notes) {
      notes = template;
    }
    this.setState({
      isEditing: true,
      notes,
    });
  }

  clearEditMode = () => this.setState({ isEditing: false });

  saveNotes = () => {
    this.props.currentModuleStore.saveNotes(this.state.notes);
    this.setState({
      isDirty: false,
      isEditing: false,
    });
  }

  cancelEdit = () => {
    this.setState({
      notes: this.origNotes,
      isEditing: false,
      isDirty: false,
    });
  };

  renderTextArea() {
    const { classes } = this.props;
    return (
      <textarea
        className={classes.textArea}
        value={this.state.notes}
        onChange={this.onChange}>
      </textarea>
    );
  }

  renderArticle() {
    const { classes } = this.props;
    const notes = this.state.notes || noNotes;
    const __html = marked(notes);
    return (
      <article
        className={classes.article}
        dangerouslySetInnerHTML={{ __html }}
      />
    );
  }

  render() {
    const { currentModule } = this.props.currentModuleStore;
    if (!currentModule) {
      return null;
    }

    const { isEditing, isDirty } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <Paper className={classes.root} elevation={1}>
          {this.props.global.isTeacher && <div>
            <Button
              variant="outlined"
              className={classes.button}
              onClick={this.setEditMode}
              disabled={isEditing}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              className={classes.button}
              onClick={this.clearEditMode}
              disabled={!isEditing}
            >
              View
            </Button>
          </div>}
          <div>
            {this.state.isEditing
              ? this.renderTextArea()
              : this.renderArticle()}
          </div>
          {isEditing && (
            <div className={classes.bottomButtonContainer}>
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={this.cancelEdit}
                disabled={!isDirty}
              >
                Cancel
            </Button>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={this.saveNotes}
                disabled={!isDirty}
              >
                Update Notes
            </Button>
            </div>
          )}
        </Paper>
      </div>
    );
  }
}

ModuleNotes.wrappedComponent.propTypes = {
  global: PropTypes.object.isRequired,
  currentModuleStore: PropTypes.object.isRequired,
};

export default withStyles(styles)(ModuleNotes);
