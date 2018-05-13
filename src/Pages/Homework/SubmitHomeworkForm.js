import React, { Component } from "react" 
import { inject, observer } from "mobx-react"
import moment from "moment"
import styles from "../../assets/styles/homework.css"


const defaultState = {
    submittingHomework: false,
    githubLink: ""
}

@inject("HomeworkStore")
@observer    
export default class SubmitHomeworkForm extends Component {

    state = defaultState

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
        const { homeworkId } = this.props
        const { githubLink } = this.state
        const timestamp = moment().format("YYYY-MM-DD hh:mm:ss")
        
        if (githubLink) {
            this.props.HomeworkStore.addSubmission(homeworkId, githubLink, timestamp)
            this.setState(defaultState)
            this.toggleSubmitHomework()
        }    
    }

    render() {
        const {
            submittingHomework,
            githubLink
        } = this.state
        
        return (
            <section>
                {submittingHomework
                    ? <div className={styles.addForm}>
                        
                        <input type="text"
                            value={githubLink}
                            placeholder="paste github link . . ."    
                            onChange={e => this.handleInputChange(e.target.value, "githubLink")}
                        />
                        <button onClick={this.addSubmission}>Submit</button>
                        <button onClick={this.toggleSubmitHomework}>Cancel</button>
                    </div>

                    : <button onClick={this.toggleSubmitHomework} className={styles.addBtn}>
                        Add Homework
                    </button>   
                }
            </section>
        )
    }
}
