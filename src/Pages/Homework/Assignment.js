import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import AssignmentSubmission from "./AssignmentSubmission"
import AssignReviewer from "./AssignReviewer"
import moment from "moment"
import styles from "../../assets/styles/homework.css"


const defaultState = {
    submittingHomework: false,
    githubLink: "",
    deadlineHasPassed: false,
}


@inject("HomeworkStore")
@observer   
export default class Assignment extends Component {

    state = defaultState

    componentWillMount() {
        const { id, deadline } = this.props
        
        // check whether assignment deadline has passed
        if (moment().isAfter(deadline)) {
            this.setState({ deadlineHasPassed: true })
            this.props.HomeworkStore.getAssignmentSubmitters(id)
        }
    }

    toggleSubmitHomework = () => {
        this.setState({
            submittingHomework: !this.state.submittingHomework
        })
    }

    handleInputChange = (inputValue, field) => {
        this.setState({
            [field]: inputValue
        })
    }

    addSubmission = () => {
        const homeworkId = this.props.id
        const { githubLink } = this.state
        const timestamp = moment().format("YYYY-MM-DD hh:mm:ss")

        if (githubLink) {
            this.props.HomeworkStore.addSubmission(homeworkId, githubLink, timestamp)
            this.setState(defaultState)
            this.toggleSubmitHomework()
        }
    }


    render() {
        const { submissions } = this.props.HomeworkStore
        const { id, module, title, instructions, deadline } = this.props
        const { submittingHomework, githubLink, deadlineHasPassed } = this.state

        const assignmentSubmissions = submissions.filter(submission => (
            submission.assignment_id === id
        ))

        return (
            <section className={styles.assignmentDiv}>
                <h2>{module}</h2>    
                <h3>{title}</h3> 
                <h4>Deadline: {moment(deadline).format("ddd MMMM Do, YYYY")}</h4>
                <a href={instructions}>Instructions</a>

                <div className={styles.submitForm}>
                {submittingHomework
                    ? <div>
                        <input type="text"
                            value={githubLink}
                            placeholder="paste github link . . ."
                            onChange={e => this.handleInputChange(e.target.value, "githubLink")}
                        />
                        <button onClick={this.addSubmission}>Submit</button>
                        <button onClick={this.toggleSubmitHomework}>Cancel</button>
                    </div>

                    : <button onClick={this.toggleSubmitHomework} className={styles.submitBtn}>
                        Submit Homework
                    </button>
                    }
                </div>   
                
                {assignmentSubmissions.map(submission => (
                    <div key={submission.id} className={styles.submission}>
                        <AssignmentSubmission
                            id={submission.id}
                            submitterName={submission.submitter_name}
                            date={submission.date}
                            githubLink={submission.github_link}
                        />

                        {deadlineHasPassed
                            ? <AssignReviewer
                                submitter={submission.submitter_name}
                                assignmentTitle={this.props.title}
                            />
                        : null }   
                    </div>    
                ))}
            </section>
        )
    }
}
