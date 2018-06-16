import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Review from './Review';
import moment from 'moment';
import styles from '../../assets/styles/homework.css';

@inject('homeworkStore')
@observer
export default class AssignmentSubmission extends Component {
  state = {
    comments: '',
    commentsOpen: false,
  };

  addReview = () => {
    const submissionId = this.props.id;
    const { comments } = this.state;
    const timestamp = moment().format('YYYY-MM-DD hh:mm:ss');

    if (comments) {
      this.props.homeworkStore.addReview(submissionId, comments, timestamp);
      this.setState({ comments: '' });
    }
  };

  handleInputChange = (value, field) => {
    this.setState({
      [field]: value,
    });
  };

  toggleComments = () => {
    this.setState({
      commentsOpen: !this.state.commentsOpen,
    });
  };

  render() {
    const { id, submitterName, githubLink, date } = this.props;
    const { currentUser, students, reviews } = this.props.homeworkStore;
    const { comments, commentsOpen } = this.state;

    const submitter =
      students.filter(student => student.username === submitterName)[0] ||
      currentUser;
    const submissionReviews = reviews.filter(
      review => review.submission_id === id
    );

    return (
      <div>
        <h3>{submitterName}</h3>
        <p className={styles.timestamp}>{moment(date).format('LLL')}</p>
        <img src={submitter.avatarUrl} alt={submitterName} />
        <a href={githubLink}>View on Github</a>

        <div className={styles.commentsDiv}>
          {commentsOpen ? (
            <div>
              <button onClick={this.toggleComments} className={styles.hideBtn}>
                Close
              </button>
              <textarea
                value={comments}
                placeholder="Give feedback . . ."
                onChange={e =>
                  this.handleInputChange(e.target.value, 'comments')
                }
              />
              <button
                onClick={this.addReview}
                className={styles.submitCommentBtn}
              >
                Submit
              </button>

              <div>
                {submissionReviews.map(review => (
                  <Review
                    key={review.id}
                    reviewerId={review.reviewer_id}
                    comments={review.comments}
                    date={review.date}
                  />
                ))}
              </div>
            </div>
          ) : (
              <button onClick={this.toggleComments} className={styles.expandBtn}>
                Expand
            </button>
            )}
        </div>
      </div>
    );
  }
}
