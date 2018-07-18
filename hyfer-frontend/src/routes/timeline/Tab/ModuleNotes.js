import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autorun } from 'mobx';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import Showdown from 'showdown';

const localStorageKey = 'hyfer:moduleNotes';
const HYF_GITHUB_URL = 'https://github.com/HackYourFuture';

function makeTemplate(module, group, duration) {

  let template = `# ${group.group_name.toUpperCase()} – ${module.module_name}

### Visit GitHub repository: [${module.module_name}](${HYF_GITHUB_URL}/${module.git_repo})

## YouTube Lecture Recordings

<!--
  To embed a YouTube videos, click the share button
  below the video and select Embed Video. Paste the
  <iframe ...> HTML segment under the Week x header
  in this file. 
-->`;

  for (let i = 0; i < duration; i++) {
    template += `\n\n### Week ${i + 1}\n\nNot yet available.`;
  }

  return template;
}

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
  },
  container: {
    width: 980,
  },
  fab: {
    position: 'absolute',
    top: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  topBar: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit / 2,
  },
  bottomBar: {
    marginBottom: theme.spacing.unit / 2,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  textArea: {
    minHeight: 480,
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
  markdownBody: {
    boxSizing: 'border-box',
    minWidth: 200,
    maxWidth: 980,
    margin: '0 auto',
    padding: 15,
  },
  markdownPadding: {
    padding: 45,
    '@media(max-width: 767px)': {
      padding: 15,
    },
  },
});

const defaultState = {
  inEditMode: false,
  isEditing: false,
  isDirty: false,
  notes: '',
};

const restoreState = {
  inEditMode: true,
  isEditing: true,
  isDirty: true,
};

@inject('currentUser', 'currentModuleStore')
@observer
class ModuleNotes extends Component {
  origNotes = '';
  runningId = -1;

  converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
    simpleLineBreaks: true,
    ghMentions: true,
    openLinksInNewWindow: true,
    emoji: true,
  });

  state = { ...defaultState };

  componentDidMount() {
    this.disposeAutoRun = autorun(() => {
      const { currentModule } = this.props.currentModuleStore;
      if (!currentModule) {
        return;
      }

      this.runningId = currentModule.id;
      const storageItem = window.sessionStorage.getItem(localStorageKey);

      let notes = '';
      if (storageItem != null) {
        try {
          const storageObj = JSON.parse(storageItem);
          if (storageObj.runningId === this.runningId) {
            notes = storageObj.notes;
            this.setState({ ...restoreState, notes });
          }
          // eslint-disable-next-line no-empty
        } catch (_) { }
      }

      if (notes === '') {
        notes = currentModule && currentModule.notes;
        this.setState({ ...defaultState, notes });
      }

      this.origNotes = notes;
    });
  }

  componentWillUnmount() {
    this.disposeAutoRun();
    window.sessionStorage.removeItem(localStorageKey);
  }

  onChange = (e) => {
    const notes = e.target.value;
    const storageItem = {
      runningId: this.runningId,
      notes,
    };
    window.sessionStorage.setItem(localStorageKey, JSON.stringify(storageItem));
    this.setState({
      notes,
      isDirty: true,
    });
  };

  setEditMode = () => {
    let { notes } = this.state;
    if (!notes) {
      notes = this.defaultNotes();
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
    // Remove any embedded HTML comments
    const notes = this.state.notes.replace(/<!--(.|\s)*?-->/g, '');

    this.props.currentModuleStore.saveNotes(notes);
    this.setState({
      isDirty: false,
      inEditMode: false,
      isEditing: false,
    });

    window.sessionStorage.removeItem(localStorageKey);
  }

  cancelEdit = () => {
    this.setState({
      notes: this.origNotes,
      isDirty: false,
      inEditMode: false,
      isEditing: false,
    });
    window.sessionStorage.removeItem(localStorageKey);
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

  defaultNotes() {
    const { module, group, currentModule } = this.props.currentModuleStore;
    return makeTemplate(module, group, currentModule.duration);
  }

  renderArticle() {
    const { classes } = this.props;
    const { inEditMode } = this.state;
    const notes = this.state.notes || this.defaultNotes();
    const __html = this.converter.makeHtml(notes);

    if (inEditMode) {
      return (
        <Paper>
          <article
            className={classNames(classes.markdownBody, 'markdown-body')}
            dangerouslySetInnerHTML={{ __html }}
          />
        </Paper>
      );
    }
    return (
      <div className={classes.article}>
        <article
          className={classNames(classes.markdownBody, classes.markdownPadding, 'markdown-body')}
          dangerouslySetInnerHTML={{ __html }}
        />
      </div>
    );
  }

  renderEditMode(classes) {
    const { isEditing, isDirty } = this.state;
    return (
      <React.Fragment>
        <Paper className={classes.topBar}>
          <Toolbar variant="dense" disableGutters>
            <Button color="primary" className={classes.button} onClick={this.setIsEditing} disabled={isEditing} >
              Edit
            </Button>
            <Button color="primary" className={classes.button} onClick={this.clearIsEditing} disabled={!isEditing} >
              View
            </Button>
          </Toolbar>
        </Paper>

        {isEditing
          ? this.renderTextArea()
          : this.renderArticle()}

        <Paper className={classes.bottomBar}>
          <Toolbar variant="dense" disableGutters>
            <Button color="secondary" className={classes.button} onClick={this.cancelEdit}>
              Cancel
            </Button>
            <Button color="primary" className={classes.button} onClick={this.saveNotes} disabled={!isDirty} >
              Update Notes
            </Button>
          </Toolbar>
        </Paper>
      </React.Fragment>
    );
  }

  renderViewMode(classes) {
    const { isTeacher } = this.props.currentUser;
    return (
      <React.Fragment>
        {isTeacher && (
          <div className={classes.bottomButtonContainer}>
            <Button variant="fab" color="primary" className={classes.fab} aria-label="Edit" onClick={this.setEditMode}>
              <EditIcon />
            </Button>
          </div>
        )}
        {this.renderArticle()}
      </React.Fragment>
    );
  }

  render() {
    const { currentModule } = this.props.currentModuleStore;
    if (!currentModule) {
      return null;
    }

    const { inEditMode } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.container}>
          {inEditMode
            ? this.renderEditMode(classes)
            : this.renderViewMode(classes)
          }
        </div>
      </div>
    );
  }
}

ModuleNotes.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  currentModuleStore: PropTypes.object.isRequired,
};

export default withStyles(styles)(ModuleNotes);
