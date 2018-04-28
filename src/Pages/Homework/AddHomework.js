import React, { Component } from "react" 
import Dropdown from "react-dropdown"
import styles from "../../assets/styles/homework.css"
import dropdownStyle from "react-dropdown/style.css"


const defaultState = {
    addingHomework: false,
    title: "",
    submitter: "",
    githubLink: ""
}


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
        const {
            title,
            submitter,
            githubLink
        } = this.state

        if (title && submitter && githubLink) {
            this.props.addSubmission(title, submitter, githubLink)
            this.setState(defaultState)
            this.toggleAddHomework()
        }    
    }

    render() {
        const {
            addingHomework,
            title,
            submitter,
            githubLink
        } = this.state

        const { students, homeworkList } = this.props
        const studentNames = students.map(student => student.name)
        const assignments = homeworkList.map(homework => homework.title)
        
        return (
            <section>
                {addingHomework
                    ? <div className={styles.addForm}>
                        <Dropdown options={studentNames}
                            value={submitter}
                            placeholder="select your name"
                            className={dropdownStyle}
                            onChange={selected => this.handleInputChange(selected.value, "submitter")}
                        /> 
                        <Dropdown options={assignments}
                            value={title}
                            placeholder="select homework"
                            className={dropdownStyle}
                            onChange={selected => this.handleInputChange(selected.value, "title")}
                        /> 
                        
                        <input type="text"
                            value={githubLink}
                            className={styles.textInput}
                            placeholder="paste github link"    
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
