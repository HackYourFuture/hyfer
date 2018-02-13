import React, { Component } from 'react';
// import { observer, inject } from 'mobx-react';
import ReactHtmlParser from 'react-html-parser';

import styles from '../../assets/styles/moduleReadme.css';
import {
  moduleInfoStoreNoMobx,
  READ_ME_CHANGED,
  REPO_NAME_CHANGED
} from '../../store';

const BASE_URL = 'https://github.com/HackYourFuture';

// @inject('moduleInfoStore')
// @observer
export default class ModuleInfo extends Component {
  state = {
    readme: null,
    repoName: null
  };

  componentDidMount = () => {
    moduleInfoStoreNoMobx.subscribe(mergedData => {
      if (mergedData.type === REPO_NAME_CHANGED) {
        this.setState({ repoName: mergedData.payload.repoName });
      } else if (mergedData.type === READ_ME_CHANGED) {
        this.setState({ readme: mergedData.payload.readme });
      }
    });
  };

  render() {
    const { repoName, readme } = this.state;
    let linkToRepo = null; // filled conditionally
    let content = readme ? readme : null;

    if (!repoName) {
      //repo is null => nothing is clicked yet
      content = <h1>select an item to view it's github readme</h1>;
    } else if (repoName === 'NOREPO') {
      //A module is clicked but it has no repo
      content = <h1>This module has no github repositroy</h1>;
    } else {
      // A module  is clicked and it has a repo => FETCH IT!
      moduleInfoStoreNoMobx.getReadme();
      content = (
        <div className={styles.readmeContiner}>{ReactHtmlParser(readme)}</div>
      );
      linkToRepo = (
        <span className={styles.linkToRepo}>
          Here is a link to the{' '}
          <a href={`${BASE_URL}/${repoName}`}>github repo</a>
        </span>
      );
    }

    return (
      <div className={styles.infoContainer}>
        <button
          onClick={() => {
            moduleInfoStoreNoMobx.setState({
              type: REPO_NAME_CHANGED,
              payload: {
                repoName: 'Javascript'
              }
            });
          }}
        >
          Click me and see what happens
        </button>
        {linkToRepo}
        {content}
      </div>
    );
  }
}
