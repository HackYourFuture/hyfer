import React, { Component } from "react"
import moment from "moment"
import Dropdown from "react-dropdown"
import styles from "../../assets/styles/homework.css"
import dropdownStyle from "react-dropdown/style.css"

export default class Submission extends Component {

    state = {
        assignedReviewer: "",
        assigningReviewer: false,
        currentReviewer: "",
        comments: "",
        commentsOpen: false,
    }

    addReview = (reviewee) => {
        const { title } = this.props
        const { currentReviewer, comments } = this.state

        if (currentReviewer && comments) {
            this.props.addReview(title, currentReviewer, reviewee, comments)
        }
        this.toggleComments()
    }

    handleInputChange = (value, field) => {
        this.setState({
            [field]: value
        })    
    }

    requestReview = (reviewee) => {
        const { assignedReviewer } = this.state
        const { title } = this.props
        if (assignedReviewer) {
            this.props.requestReview(assignedReviewer, title, reviewee)
        }
        this.toggleAssignReviewer()
    }

    toggleAssignReviewer = () => {
        this.setState({
            assigningReviewer: !this.state.assigningReviewer
        })
    }

    toggleComments = () => {
        this.setState({
            commentsOpen: !this.state.commentsOpen
        })
    }

    render() {
        const { homework, students } = this.props
        const {
            assigningReviewer,
            assignedReviewer,
            currentReviewer,
            comments,
            commentsOpen
        } = this.state

        const studentNames = students.map(student => student.name)

        return (
            <section className={styles.hmwrkSubmission}>
                {homework.submissions.map(submission => (
                    <div key={submission.submitter} className={styles.submitter}>
                        <h3>{submission.submitter}</h3>
                        {students.map(student => (
                            student.name === submission.submitter ? <img src={student.avatar} alt={student.name} key={student.name} /> : null
                        ))}
                        <a href={submission.githubLink}>Homework</a>
                        {assigningReviewer
                            ? <div>
                                <Dropdown options={studentNames}
                                    value={assignedReviewer}
                                    placeholder="select reviewer"
                                    className={dropdownStyle}
                                    onChange={selected => this.handleInputChange(selected.value, "assignedReviewer")}
                                /> 
                                <button onClick={() => this.requestReview(submission.submitter)}>Request</button>
                                <button onClick={this.toggleAssignReviewer}>Cancel</button>
                            </div>
                            : <button onClick={this.toggleAssignReviewer} className={styles.assignBtn}>Request Review</button>
                        }
                        <p>Submitted: {moment().calendar()} </p>

                        {commentsOpen
                            ? <div>
                                <Dropdown options={studentNames}
                                    value={currentReviewer}
                                    placeholder="select your name"
                                    className={dropdownStyle}
                                    onChange={selected => this.handleInputChange(selected.value, "currentReviewer")}
                                /> 
                                <textarea value={comments} placeholder="enter review ..." onChange={e => this.handleInputChange(e.target.value, "comments")}/>
                                <button onClick={() => this.addReview(submission.submitter)}>Submit</button>
                                <button onClick={this.toggleComments}>Cancel</button>
                            </div>
                            : <button onClick={this.toggleComments} className={styles.replyBtn}>Reply</button>
                        }
                    </div>
                ))}
            </section>
        )
    }
}
