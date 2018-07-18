import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toJS, autorun } from 'mobx';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import Showdown from 'showdown';
import MarkdownEditor from '../../../components/MarkdownEditor';
import '!style-loader!css-loader!github-markdown-css';

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
  article: {
    textAlign: 'left',
    width: '100%',
    ...theme.typography.body1,
  },
  markdownBody: {
    boxSizing: 'border-box',
    minWidth: 200,
    maxWidth: 980,
    margin: '0 auto',
    padding: theme.spacing.unit * 4,
    '@media(max-width: 767px)': {
      padding: theme.spacing.unit * 2,
    },
  },
});

const defaultState = {
  inEditMode: false,
  markdown: '',
};

const restoreState = {
  inEditMode: true,
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

      this.origNotes = currentModule && currentModule.notes;

      this.runningId = currentModule.id;
      const storageItem = window.sessionStorage.getItem(localStorageKey);

      let markdown = '';
      if (storageItem != null) {
        try {
          const storageObj = JSON.parse(storageItem);
          if (storageObj.runningId === this.runningId) {
            markdown = storageObj.markdown;
            this.setState({ ...restoreState, markdown });
          }
          // eslint-disable-next-line no-empty
        } catch (_) { }
      }

      if (markdown === '') {
        markdown = this.origNotes;
        this.setState({ ...defaultState, markdown });
      }
    });
  }

  componentWillUnmount() {
    this.disposeAutoRun();
    window.sessionStorage.removeItem(localStorageKey);
  }

  onChange = (markdown) => {
    const storageItem = {
      runningId: this.runningId,
      markdown,
    };
    window.sessionStorage.setItem(localStorageKey, JSON.stringify(storageItem));
    this.setState({ markdown });
  };

  setEditMode = () => {
    let { markdown } = this.state;
    if (!markdown) {
      markdown = this.defaultNotes();
    }
    this.setState({
      inEditMode: true,
      markdown,
    });
  }

  setIsEditing = () => this.setState({ isEditing: true });
  clearIsEditing = () => this.setState({ isEditing: false });

  saveNotes = (markdown) => {
    // Remove any embedded HTML comments
    const notes = markdown.replace(/<!--(.|\s)*?-->/g, '');
    this.props.currentModuleStore.saveNotes(notes);
    this.setState({ inEditMode: false });
    window.sessionStorage.removeItem(localStorageKey);
  }

  cancelEdit = () => {
    this.setState({
      markdown: this.origNotes,
      inEditMode: false,
    });
    window.sessionStorage.removeItem(localStorageKey);
  };

  defaultNotes() {
    const { module, group, currentModule } = this.props.currentModuleStore;
    return makeTemplate(module, group, currentModule.duration);
  }

  renderArticle() {
    const { classes } = this.props;
    const markdown = this.state.markdown || this.defaultNotes();
    const __html = this.converter.makeHtml(markdown);

    return (
      <div className={classes.article}>
        <article
          className={classNames(classes.markdownBody, 'markdown-body')}
          dangerouslySetInnerHTML={{ __html }}
        />
      </div>
    );
  }

  renderEditMode() {
    console.log();
    return (
      <MarkdownEditor
        markdown={toJS(this.state.markdown)}
        onChange={this.onChange}
        onSave={this.saveNotes}
        onCancel={this.cancelEdit}
      />
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
            ? this.renderEditMode()
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
