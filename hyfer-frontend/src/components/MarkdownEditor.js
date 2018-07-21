import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import ReactMde from 'react-mde';
import Showdown from 'showdown';
import '!style-loader!css-loader!github-markdown-css';
import '!style-loader!css-loader!draft-js/dist/Draft.css';
import '!style-loader!css-loader!react-mde/lib/styles/css/react-mde-all.css';

const styles = {
  root: {
    height: '100%',
    overflowY: scroll,
  },
};

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

  render() {
    const { classes } = this.props;

    return (
      <ReactMde
        className={classNames(classes.root, 'markdown-body')}
        layout='tabbed'
        onChange={this.handleValueChange}
        editorState={this.state.mdeState}
        generateMarkdownPreview={(markdown) => Promise.resolve(this.converter.makeHtml(markdown))}
      />
    );
  }
}

MarkdownEditor.propTypes = {
  classes: PropTypes.object.isRequired,
  markdown: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

MarkdownEditor.defaultProps = {
  onChange: () => undefined,
};

export default withStyles(styles)(MarkdownEditor);
