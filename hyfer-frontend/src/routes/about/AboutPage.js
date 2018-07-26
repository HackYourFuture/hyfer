import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import MarkdownViewer from '../../components/MarkdownViewer';

async function fetchText(path) {
  const headers = { 'Content-Type': 'text/plain' };
  const res = await fetch(path, headers);
  return res.status === 200 ? res.text() : undefined;
}

@inject('currentModule', 'currentUser', 'notification')
@observer
export default class AboutPage extends React.Component {
  state = {
    markdown: null,
  }

  componentDidMount() {
    fetchText('./content/about.md')
      .then(markdown => this.setState({ markdown }))
      .catch(this.props.notification.reportError);
  }

  render() {
    const { markdown } = this.state;
    if (markdown == null) {
      return null;
    }

    return (
      <Grid container justify="center" spacing={24}>
        <Grid item xs={12} sm={8} lg={6} xl={4}>
          <MarkdownViewer markdown={markdown} />
        </Grid>
      </Grid>
    );
  }
}

AboutPage.wrappedComponent.propTypes = {
  notification: PropTypes.object.isRequired,
};
