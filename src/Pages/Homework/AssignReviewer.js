import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import styles from "../../assets/styles/homework.css"


@inject("HomeworkStore")
@observer
export default class AssignReviewer extends Component {

    state = {
        selectingReviewer: false,
        assignedReviewer: ""
    }

    toggleAssignReviewer = () => {
        this.setState({
            selectingReviewer: !this.state.selectingReviewer
        })
    }

    requestReview = () => {
        const { submitter, assignmentTitle, submissionId } = this.props
        const { assignedReviewer } = this.state

        if (assignedReviewer) {
            this.props.HomeworkStore.addReviewer(assignedReviewer, submissionId)
            this.props.HomeworkStore.requestReview(submitter, assignmentTitle, assignedReviewer)
            this.props.HomeworkStore.updateSubmitters(submitter)
            this.props.HomeworkStore.updateReviewers(assignedReviewer)
            this.toggleAssignReviewer()
        }

    }

    handleReviewerChange = (reviewer) => {
        this.setState({
            assignedReviewer: reviewer
        })
    }


    render() {
        const { unassignedReviewers } = this.props.HomeworkStore
        const { reviewer } = this.props
        const { selectingReviewer, assignedReviewer } = this.state

        return (
            <div className={styles.assignReviewer}>
                {reviewer 
                    ? <h4>Reviewer: <span>{reviewer}</span></h4>
                    : <div>
                        {selectingReviewer
                            ? <div>
                                <select value={assignedReviewer}
                                    className={styles.assignReview}    
                                    onChange={e => this.handleReviewerChange(e.target.value)}>
                                    <option value="" disabled hidden>Select reviewer</option>
                                    {unassignedReviewers.map(reviewer => (
                                        <option key={reviewer.id} value={reviewer.username}>{reviewer.username}</option>
                                    ))}
                                </select>
                                <button className={styles.saveButtonReviewer} onClick={this.requestReview}>Save</button>
                                <button className={styles.cancelButtonReviewer} onClick={this.toggleAssignReviewer}>Cancel</button>
                            </div>
                            : <button onClick={this.toggleAssignReviewer} className={styles.assignBtn}>Assign</button>
                        }
                    </div>
                } 
            </div>
        )
    }
}
