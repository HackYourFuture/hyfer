import React, { Component } from "react"
import moment from "moment"
import styles from "../../assets/styles/homework.css"


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
            this.props.addReview(reviewee, comments)
            this.toggleComments()
            this.setState({ comments: "" })
        }
    }

    handleInputChange = (value, field) => {
        this.setState({
            [field]: value
        })    
    }

    requestReview = (reviewee) => {
        const { assignedReviewer } = this.state
        if (assignedReviewer) {
            this.props.requestReview(assignedReviewer, reviewee)
        }
        this.toggleAssignReviewer()
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
        const { students, submissions } = this.props
        const {
            selectingReviewer,
            comments,
            commentsOpen
        } = this.state

        return (
            <section className={styles.hmwrkSubmission}>
                {submissions.map(submission => (
                    <div key={submission.submitter} className={styles.submitter}>
                        <h3>{submission.submitter}</h3>
                        <p className={styles.timestamp}>{moment().format("LLL")}</p>
                        {students.map(student => (
                            student.name === submission.submitter
                                ? <img src={student.avatar} alt={student.name} key={student.name} />
                                : null
                        ))}

                        <div className={styles.assignReviewer}>
                            {selectingReviewer
                                ? <div>
                                    <select placeholder="Students"
                                        onChange={e => this.handleInputChange(e.target.value, "assignedReviewer")}>
                                        {students.map(student => (
                                        <option key={student.name} value={student.name}>{student.name}</option>   
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
