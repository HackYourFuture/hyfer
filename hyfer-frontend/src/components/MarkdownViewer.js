import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Showdown from 'showdown';
import '!style-loader!css-loader!github-markdown-css';

const styles = theme => ({
  article: {
    textAlign: 'left',
    width: '100%',
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
    ...theme.typography.body1,
  },
  markdownBody: {
    boxSizing: 'border-box',
    minWidth: 200,
    maxWidth: 980,
    margin: '0 auto',
    ...theme.mixins.gutters(),
  },
});

class MarkdownViewer extends React.Component {

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

  render() {
    const { classes, markdown } = this.props;
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
}

MarkdownViewer.propTypes = {
  classes: PropTypes.object,
  markdown: PropTypes.string,
};

MarkdownViewer.defaultProps = {
  markdown: '',
  className: '',
};

export default withStyles(styles)(MarkdownViewer);
