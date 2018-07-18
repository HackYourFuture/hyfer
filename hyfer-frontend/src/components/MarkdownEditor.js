import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import ReactMde from 'react-mde';
import Showdown from 'showdown';
import '!style-loader!css-loader!github-markdown-css';
import '!style-loader!css-loader!draft-js/dist/Draft.css';
import '!style-loader!css-loader!react-mde/lib/styles/css/react-mde-all.css';

const styles = (theme) => ({
  container: {
    width: '100%',
    height: 400,
    paddingTop: theme.spacing.unit,
  },
  editor: {
    height: '100%',
    overflowY: scroll,
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

class MarkdownEditor extends Component {

  state = {
    mdeState: null,
  };

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

  componentDidMount() {
    this.setState({ mdeState: { markdown: this.props.markdown } });
  }

  handleValueChange = (mdeState) => {
    this.setState({ mdeState });
    this.props.onChange(mdeState.markdown);
  }

  handleSaveClick = () => this.props.onSave(this.state.mdeState.markdown);

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <div className={classes.container}>
          <ReactMde
            className={classNames(classes.editor, 'markdown-body')}
            layout='tabbed'
            onChange={this.handleValueChange}
            editorState={this.state.mdeState}
            generateMarkdownPreview={(markdown) => Promise.resolve(this.converter.makeHtml(markdown))}
          />
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

MarkdownEditor.propTypes = {
  classes: PropTypes.object.isRequired,
  markdown: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

MarkdownEditor.defaultProps = {
  onChange: () => undefined,
};

export default withStyles(styles)(MarkdownEditor);
