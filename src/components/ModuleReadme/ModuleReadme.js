import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';

import styles from '../../assets/styles/moduleReadme.css';
import {
  moduleInfoStore,
  READ_ME_CHANGED,
  REPO_NAME_CHANGED
} from '../../store';

const BASE_URL = 'https://github.com/HackYourFuture';

export default class ModuleInfo extends Component {
  state = {
    readme: null,
    repoName: null
  };

  componentDidMount = () => {
    moduleInfoStore.subscribe(mergedData => {
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
      content = (
        <div className={styles.readmeContiner}>
          <h2>select an item to view it's github readme</h2>
        </div>
      )
    } else if (repoName === 'NOREPO') {
      //A module is clicked but it has no repo
      content = (
        <div className={styles.readmeContiner}>
          <h2>This module has no github repositroy</h2>
        </div>
      )
    } else {
      // A module  is clicked and it has a repo => FETCH IT!
      content = (
        <div className={styles.readmeContiner}>{ReactHtmlParser(readme)}</div>
      );
      linkToRepo = (
        <div className={styles.linkToRepo}>
          <a href={`${BASE_URL}/${repoName}`}><span>VISIT REPOSITORY</span>
          <svg width="20px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.414" fit=""  preserveAspectRatio="xMidYMid meet" focusable="false">
            <path d="M8 0a8 8 0 0 0-8 8 8 8 0 0 0 5.47 7.59c.4.075.547-.172.547-.385 0-.19-.007-.693-.01-1.36-2.226.483-2.695-1.073-2.695-1.073-.364-.924-.89-1.17-.89-1.17-.725-.496.056-.486.056-.486.803.056 1.225.824 1.225.824.714 1.223 1.873.87 2.33.665.072-.517.278-.87.507-1.07-1.777-.2-3.644-.888-3.644-3.953 0-.873.31-1.587.823-2.147-.09-.202-.36-1.015.07-2.117 0 0 .67-.215 2.2.82a7.67 7.67 0 0 1 2-.27 7.67 7.67 0 0 1 2 .27c1.52-1.035 2.19-.82 2.19-.82.43 1.102.16 1.915.08 2.117a3.1 3.1 0 0 1 .82 2.147c0 3.073-1.87 3.75-3.65 3.947.28.24.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.14.46.55.38A7.972 7.972 0 0 0 16 8a8 8 0 0 0-8-8" />   
          </svg></a>
        </div>
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
