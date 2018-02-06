import { observable, runInAction, action } from 'mobx';
import marked from 'marked';

const BASE_URL = 'https://api.github.com/repos/HackYourFuture';
export default class ModuleInfoStore {
  @observable repoName = null;
  @observable readme = null;

  @action
  getInfo = name => {
    fetch(`${BASE_URL}/${this.repoName}/readme`)
      .then(res => res.json())
      .then(jsonRes => {
        runInAction(() => {
          this.readme = this.decodeAndTurnInHtml(jsonRes.content);
        });
      });
  };

  @action
  handleGetReadme = clickEvent => {
    const modulesWithNoRepo = [
      'Holiday',
      'Hackathon',
      'Project presentations',
      'Prep (technical) interviews',
      'Hardware workshop',
      'Resume training'
    ];
    const target = clickEvent.event.target;
    const gitRepoDataField = target.parentNode.parentNode.dataset.git_repo;
    const noRepoAlternative = 'NOREPO'; // alternative name for if a module doesn't have a repo
    if (target.className !== 'vis-item-content') return; // if the selected element is not the wanted one

    // if the selected element doesn't have a repo
    if (modulesWithNoRepo.includes(target.innerHTML)) {
      console.log('here');
      this.repoName = noRepoAlternative;
      return;
    } else if (target.innerHTML === 'React') {
      console.log('here');
      this.repoName = 'React';
    } else if (target.innerHTML === 'HTML-CSS') {
      this.repoName = 'HTML-CSS';
    } else {
      this.repoName = gitRepoDataField;
    }
  };

  decodeAndTurnInHtml = data => {
    const decoded = atob(data);
    return marked(decoded);
  };
}
