import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autorun } from 'mobx';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
// import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
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
  inEditMode: false,
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
      inEditMode: true,
      isEditing: true,
      notes,
    });
  }

  setIsEditing = () => this.setState({ isEditing: true });
  clearIsEditing = () => this.setState({ isEditing: false });

  saveNotes = () => {
    this.props.currentModuleStore.saveNotes(this.state.notes);
    this.setState({
      isDirty: false,
      inEditMode: false,
      isEditing: false,
    });
  }

  cancelEdit = () => {
    this.setState({
      notes: this.origNotes,
      isDirty: false,
      inEditMode: false,
      isEditing: false,
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

    const { inEditMode, isEditing, isDirty } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <Paper className={classes.root} elevation={1}>
          {this.props.global.isTeacher && <div>
            {!inEditMode && <div className={classes.bottomButtonContainer}>
              <IconButton
                className={classes.button}
                aria-label="Edit"
                onClick={this.setEditMode}
              >
                <EditIcon />
              </IconButton>
            </div>}
            {inEditMode && <React.Fragment>
              <Button
                variant="outlined"
                color="primary"
                className={classes.button}
                onClick={this.setIsEditing}
                disabled={isEditing}
              >
                Edit
                </Button>
              <Button
                variant="outlined"
                className={classes.button}
                onClick={this.clearIsEditing}
                disabled={!isEditing}
              >
                View
                </Button>
            </React.Fragment>}
          </div>}
          <div>
            {this.state.isEditing
              ? this.renderTextArea()
              : this.renderArticle()}
          </div>
          {inEditMode && (
            <div className={classes.bottomButtonContainer}>
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={this.cancelEdit}
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
