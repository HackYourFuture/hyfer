import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import SubmitHomeworkForm from "./SubmitHomeworkForm"
import moment from "moment"
import styles from "../../assets/styles/homework.css"

@inject("HomeworkStore")
@observer   
export default class HomeworkItem extends Component {

    state = {
        assignedReviewer: "",
        selectingReviewer: false,
        comments: "",
        commentsOpen: false,
    }


    addReview = (submissionId) => {
        const { comments } = this.state
        const timestamp = moment().format("YYYY-MM-DD hh:mm:ss")

        if (comments) {
            this.props.HomeworkStore.addReview(submissionId, comments, timestamp)
            this.toggleComments()
            this.setState({ comments: "" })
        }
    }

    requestReview = (submissionId) => {
        const { assignedReviewer } = this.state
        const { title } = this.props
        if (assignedReviewer) {
            this.props.HomeworkStore.requestReview(submissionId, title, assignedReviewer)
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
        const { students, submissions, currentUser } = this.props.HomeworkStore
        const { id, title, deadline } = this.props

        const currentHomeworkSubmissions = submissions.filter(submission => (
            submission.homework_id === id
        ))
       
        const {
            selectingReviewer,
            comments,
            commentsOpen
        } = this.state

        return (
            <section className={styles.hmwrkSubmission}>
                <h2>{title}</h2> 
                <h4>Deadline: {moment(deadline).format("ddd MMMM Do, YYYY")}</h4>

                <SubmitHomeworkForm homeworkId={id} /> 
                
                {currentHomeworkSubmissions.map(submission => (
                    <div key={submission.id} className={styles.submitter}>
                        <h3>{submission.username}</h3>
                        <p className={styles.timestamp}>{moment(submission.date).format("LLL")}</p>
                        {students.map(student => (
                            submission.username === student.username
                                ? <img src={student.avatarUrl} alt={student.username} key={student.id} />
                                : null
                        ))}

                        <div className={styles.assignReviewer}>
                            {selectingReviewer
                                ? <div>
                                    <select placeholder="Students"
                                        onChange={e => this.handleInputChange(e.target.value, "assignedReviewer")}>
                                        {students.map(student => (
                                        <option key={student.id} value={student.username}>{student.username}</option>   
                                        ))}    
                                    </select>
                                    <button onClick={() => this.requestReview(submission.id)}>Request</button>
                                    <button onClick={this.toggleAssignReviewer}>Cancel</button>
                                </div>
                                : <button onClick={this.toggleAssignReviewer} className={styles.assignBtn}>Request Review</button>
                            }
                        </div>    

                        <a href={submission.github_link}>View homework</a>
                        
                        <div className={styles.replyContainer}>
                            {commentsOpen
                                ? <div>
                                    <textarea value={comments} placeholder="enter review . . ."
                                        onChange={e => this.handleInputChange(e.target.value, "comments")}
                                    />
                                    <button onClick={() => this.addReview(submission.id)}>Submit</button>
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
