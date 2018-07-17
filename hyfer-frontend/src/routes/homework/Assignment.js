/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import AssignmentSubmission from './AssignmentSubmission';
import AssignReviewer from './AssignReviewer';
import moment from 'moment';
import styles from './homework.css';

const defaultState = {
  submittingHomework: false,
  githubLink: '',
  deadlineHasPassed: false,
};

@inject('homeworkStore')
@observer
export default class Assignment extends Component {
  state = defaultState;

  componentDidMount() {
    const { deadline } = this.props;

    // check whether assignment deadline has passed
    if (moment().isAfter(deadline)) {
      this.setState({ deadlineHasPassed: true });
    }
  }

  toggleSubmitHomework = () => {
    this.setState({
      submittingHomework: !this.state.submittingHomework,
    });
  };

  handleInputChange = (inputValue, field) => {
    this.setState({
      [field]: inputValue,
    });
  };

  addSubmission = () => {
    const homeworkId = this.props.id;
    const { githubLink } = this.state;
    const timestamp = moment().format('YYYY-MM-DD hh:mm:ss');

    if (githubLink) {
      this.props.homeworkStore.addSubmission(homeworkId, githubLink, timestamp);
      this.setState(defaultState);
      this.toggleSubmitHomework();
    }

    window.location.reload();
  };

  fetchAssignmentSubmitters = () => {
    const { id } = this.props;
    this.props.homeworkStore.setAssigningReviewersId(id);
    this.props.homeworkStore.getAssignmentSubmitters(id);
  };

  render() {
    const { submissions, assigningReviewersId } = this.props.homeworkStore;
    const { id, module, title, instructions, deadline } = this.props;
    const { submittingHomework, githubLink, deadlineHasPassed } = this.state;

    const assignmentSubmissions = submissions.filter(
      submission => submission.assignment_id === id
    );

    return (
      <section className={styles.assignmentDiv}>
        <h2>{module}</h2>
        <h3>{title}</h3>
        <h4>
          Deadline: <span>{moment(deadline).format('ddd MMMM Do, YYYY')}</span>
        </h4>
        <a href={instructions}>Instructions</a>

        <div className={styles.submitForm}>
          {submittingHomework ? (
            <div>
              <input
                type="text"
                value={githubLink}
                placeholder="Github link . . ."
                onChange={e =>
                  this.handleInputChange(e.target.value, 'githubLink')
                }
              />
              <button onClick={this.addSubmission}>Submit</button>
              <button onClick={this.toggleSubmitHomework}>Cancel</button>
            </div>
          ) : (
              <button
                onClick={this.toggleSubmitHomework}
                className={styles.submitBtn}
              >
                Submit Homework
            </button>
            )}
        </div>

        {deadlineHasPassed ? (
          <button
            onClick={this.fetchAssignmentSubmitters}
            className={styles.assignBtn}
          >
            Assign Reviewers
          </button>
        ) : null}

        {assignmentSubmissions.map(submission => (
          <div key={submission.id} className={styles.submission}>
            <AssignmentSubmission
              id={submission.id}
              submitterName={submission.submitter_name}
              date={submission.date}
              githubLink={submission.github_link}
            />

            {assigningReviewersId === id ? (
              <AssignReviewer
                submitter={submission.submitter_name}
                assignmentTitle={this.props.title}
                submissionId={submission.id}
                reviewer={submission.reviewer}
              />
            ) : null}
          </div>
        ))}
      </section>
    );
  }
}
