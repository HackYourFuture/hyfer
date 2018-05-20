import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import styles from "../../assets/styles/homework.css"


@inject("HomeworkStore")
@observer
export default class AssignReviewer extends Component {

    state = {
        selectingReviewer: false,
        assignedReviewer: "",
        doneAssigning: false
    }

    toggleAssignReviewer = () => {
        this.setState({
            selectingReviewer: !this.state.selectingReviewer
        })
    }

    requestReview = () => {
        const { submitter, assignmentTitle } = this.props
        const { assignedReviewer } = this.state

        if (assignedReviewer) {
            this.props.HomeworkStore.requestReview(submitter, assignmentTitle, assignedReviewer)
            this.props.HomeworkStore.updateSubmitters(submitter)
            this.props.HomeworkStore.updateReviewers(assignedReviewer)
            this.setState({ doneAssigning: true })
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
        const { selectingReviewer, assignedReviewer, doneAssigning } = this.state

        return (
            <div className={styles.assignReviewer}>
                {doneAssigning 
                    ? <h4>Reviewer: {assignedReviewer}</h4>
                    : <div>
                        {selectingReviewer
                            ? <div>
                                <select value={assignedReviewer}
                                    onChange={e => this.handleReviewerChange(e.target.value)}>
                                    <option value="" disabled hidden>Select reviewer</option>
                                    {unassignedReviewers.map(reviewer => (
                                        <option key={reviewer.id} value={reviewer.username}>{reviewer.username}</option>
                                    ))}
                                </select>
                                <button onClick={this.requestReview}>Save</button>
                                <button onClick={this.toggleAssignReviewer}>Cancel</button>
                            </div>
                            : <button onClick={this.toggleAssignReviewer} className={styles.assignBtn}>Assign Reviewer</button>
                        }
                    </div>
                } 
            </div>
        )
    }
}
