import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const HYF_GITHUB_URL = 'https://github.com/HackYourFuture';

const styles = (theme) => ({
  linkToRepo: {
    float: 'right',
    cursor: 'pointer',
    textAlign: 'center',
    marginRight: '10%',
    margin: 10,
    '&:hover': {
      boxShadow: '0px 3px 18px 1px rgba(0,0,0,0.1)',
      backgroundColor: 'rgb(224, 224, 226)',
    },
    '& a': {
      textDecoration: 'none',
      color: '#0366d6',
    },
  },
  icon: {
    marginLeft: theme.spacing.unit * 2,
  },
  markdownBody: {
    boxSizing: 'border-box',
    minWidth: 200,
    maxWidth: 980,
    margin: '0 auto',
    padding: 45,
    '@media(max-width: 767px)': {
      padding: 15,
    },
  },
});

@inject('currentModuleStore')
@observer
class ModuleReadMe extends Component {
  componentDidMount() {
    this.props.currentModuleStore.getReadme('curriculum');
  }

  render() {
    const { readme } = this.props.currentModuleStore;
    if (!readme) {
      return null;
    }

    const { classes } = this.props;

    return (
      <div className={classes.infoContainer}>
        <div className={classes.linkToRepo}>
          <a href={`${HYF_GITHUB_URL}/${readme.repoName}`} target="_blank">
            <Button color="primary" className={classes.button}>
              Visit Repository
              <Icon className={classNames(classes.icon, 'fab fa-github')} />
            </Button>
          </a>
        </div>
        <article className={`${classes.markdownBody} markdown-body`} dangerouslySetInnerHTML={{ __html: readme.html }} />
      </div>
    );
  }
}

ModuleReadMe.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentModuleStore: PropTypes.object.isRequired,
};

export default withStyles(styles)(ModuleReadMe);
