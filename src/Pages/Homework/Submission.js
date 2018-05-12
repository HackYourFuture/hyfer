import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import moment from "moment"
import styles from "../../assets/styles/homework.css"

@inject("HomeworkStore")
@observer   
export default class Submission extends Component {

    state = {
        assignedReviewer: "",
        selectingReviewer: false,
        comments: "",
        commentsOpen: false,
    }


    addReview = (reviewee) => {
        const { comments } = this.state

        if (comments) {
            this.props.HomeworkStore.addReview(reviewee, comments)
            this.toggleComments()
            this.setState({ comments: "" })
        }
    }

    requestReview = (submitter) => {
        const { assignedReviewer } = this.state
        if (assignedReviewer) {
            this.props.HomeworkStore.requestReview(submitter, assignedReviewer)
        }
        this.toggleAssignReviewer()
    }

    handleInputChange = (value, field) => {
        this.setState({
            [field]: value
        })
    }

    toggleAssignReviewer = () => {
        this.setState({
            selectingReviewer: !this.state.selectingReviewer
        })
    }

    toggleComments = () => {
        this.setState({
            commentsOpen: !this.state.commentsOpen
        })
    }

    render() {
        const { currentGroupStudents, currentGroupSubmissions } = this.props.HomeworkStore
       
        const {
            selectingReviewer,
            comments,
            commentsOpen
        } = this.state

        return (
            <section className={styles.hmwrkSubmission}>
                {currentGroupSubmissions.map(submission => (
                    <div key={submission.submitter} className={styles.submitter}>
                        <h3>{submission.submitter}</h3>
                        <p className={styles.timestamp}>{moment(submission.date).format("LLL")}</p>
                        {currentGroupStudents.map(student => (
                            submission.submitter === student.name || submission.submitter === student.login
                                ? <img src={student.avatar_url} alt={student.login} key={student.id} />
                                : null
                        ))}

                        <div className={styles.assignReviewer}>
                            {selectingReviewer
                                ? <div>
                                    <select placeholder="Students"
                                        onChange={e => this.handleInputChange(e.target.value, "assignedReviewer")}>
                                        {currentGroupStudents.map(student => (
                                        <option key={student.id} value={student.name || student.login}>{student.name || student.login}</option>   
                                        ))}    
                                    </select>
                                    <button onClick={() => this.requestReview(submission.submitter)}>Request</button>
                                    <button onClick={this.toggleAssignReviewer}>Cancel</button>
                                </div>
                                : <button onClick={this.toggleAssignReviewer} className={styles.assignBtn}>Request Review</button>
                            }
                        </div>    

                        <a href={submission.githubLink}>View homework</a>
                        
                        <div className={styles.replyContainer}>
                            {commentsOpen
                                ? <div>
                                    <textarea value={comments} placeholder="enter review . . ."
                                        onChange={e => this.handleInputChange(e.target.value, "comments")}
                                    />
                                    <button onClick={() => this.addReview(submission.submitter)}>Submit</button>
                                    <button onClick={this.toggleComments}>Cancel</button>
                                </div>
                                : <button onClick={this.toggleComments} className={styles.replyBtn}>Reply</button>
                            }
                        </div>    
                    </div>
                ))}
            </section>
        )
    }
}
