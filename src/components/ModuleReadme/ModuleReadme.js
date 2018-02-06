import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import ReactHtmlParser from 'react-html-parser';

import styles from '../../assets/styles/moduleReadme.css';

const BASE_URL = 'https://github.com/HackYourFuture';

@inject('moduleInfoStore')
@observer
export default class ModuleInfo extends Component {
  sendRequestReadme = () => {
    this.props.moduleInfoStore.getInfo();
  };

  render() {
    const { repoName, readme } = this.props.moduleInfoStore;
    let linkToRepo = null; // filled conditionally
    let content = null; // filled conditionally

    if (!repoName) {
      //repo is null => nothing is clicked yet
      content = <h1>select an item to view it's github readme</h1>;
    } else if (repoName === 'NOREPO') {
      //A module is clicked but it has no repo
      content = <h1>This module has no github repositroy</h1>;
    } else {
      // A module  is clicked and it has a repo => FETCH IT!
      this.sendRequestReadme();
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
        {linkToRepo}
        {content}
      </div>
    );
  }
}
