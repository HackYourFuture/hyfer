import React from 'react';
import PropTypes from 'prop-types';
import { toJS, autorun } from 'mobx';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import Showdown from 'showdown';
import ModuleNotesEditor from './ModuleNotesEditor';
import MarkdownViewer from '../../../components/MarkdownViewer';
import '!style-loader!css-loader!github-markdown-css';

const localStorageKey = 'hyfer:moduleNotes';
const HYF_GITHUB_URL = 'https://github.com/HackYourFuture';

function standardHeader(selectedModule) {
  const { group_name, module_name, starting_date, ending_date, git_repo } = selectedModule;
  const classNumber = group_name.match(/\d+/)[0];

  return `# ${module_name}
  
  _Class ${classNumber}, ${starting_date.format('D MMMM YYYY')} – ${ending_date.format('D MMMM YYYY')}_

  [Visit Repository ](${HYF_GITHUB_URL}/${git_repo}) <i class="fab fa-github fa-lg"></i>

`;
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
});

const defaultState = {
  inEditMode: false,
  markdown: '',
};

const restoreState = {
  inEditMode: true,
};

@inject('currentUser', 'currentModule')
@observer
class ModuleNotes extends React.Component {
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
      const { selectedModule, notes } = this.props.currentModule;
      if (!selectedModule) {
        return;
      }

      this.origNotes = notes;
      this.runningId = selectedModule.running_module_id;
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
    this.setState({ inEditMode: true });
  }

  setIsEditing = () => this.setState({ isEditing: true });
  clearIsEditing = () => this.setState({ isEditing: false });

  saveNotes = (markdown) => {
    // Remove any embedded HTML comments
    const notes = markdown.replace(/<!--(.|\s)*?-->/g, '');
    this.props.currentModule.saveNotes(notes);
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

  renderArticle() {
    const markdown = standardHeader(this.props.currentModule.selectedModule) + this.state.markdown;
    return <MarkdownViewer markdown={markdown} />;
  }

  renderEditMode() {
    return (
      <ModuleNotesEditor
        markdown={toJS(this.state.markdown)}
        onChange={this.onChange}
        onSave={this.saveNotes}
        onCancel={this.cancelEdit}
      />
    );
  }

  renderViewMode(classes) {
    const { isTeacher, user } = this.props.currentUser;
    const { group } = this.props.currentModule;
    return (
      <React.Fragment>
        {(isTeacher || user.group_id === group.id) && (
          <div className={classes.bottomButtonContainer}>
            <Tooltip title="Edit notes">
              <Button variant="fab" color="primary" className={classes.fab} aria-label="Edit" onClick={this.setEditMode}>
                <EditIcon />
              </Button>
            </Tooltip>
          </div>
        )}
        {this.renderArticle()}
      </React.Fragment>
    );
  }

  render() {
    const { selectedModule } = this.props.currentModule;
    if (!selectedModule) {
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
  currentModule: PropTypes.object.isRequired,
};

export default withStyles(styles)(ModuleNotes);
