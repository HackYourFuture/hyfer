import React, { Component } from "react" 
import { inject, observer } from "mobx-react"
import styles from "../../assets/styles/homework.css"


const defaultState = {
    addingHomework: false,
    githubLink: ""
}

@inject("HomeworkStore")
@observer    
export default class AddHomework extends Component {

    state = defaultState

    toggleAddHomework = () => {
        this.setState({
            addingHomework: !this.state.addingHomework
        })
    }

    handleInputChange = (inputValue, field) => {
        this.setState({
            [field]: inputValue
        })
    }

    addSubmission = () => {
        const { githubLink } = this.state

        if (githubLink) {
            this.props.HomeworkStore.addSubmission(githubLink)
            this.setState(defaultState)
            this.toggleAddHomework()
        }    
    }

    render() {
        const {
            addingHomework,
            githubLink
        } = this.state
        
        return (
            <section>
                {addingHomework
                    ? <div className={styles.addForm}>
                        
                        <input type="text"
                            value={githubLink}
                            placeholder="paste github link . . ."    
                            onChange={e => this.handleInputChange(e.target.value, "githubLink")}
                        />
                        <button onClick={this.addSubmission}>Submit</button>
                        <button onClick={this.toggleAddHomework}>Cancel</button>
                    </div>

                    : <button onClick={this.toggleAddHomework} className={styles.addBtn}>
                        Add Homework
                    </button>   
                }
            </section>
        )
    }
}
