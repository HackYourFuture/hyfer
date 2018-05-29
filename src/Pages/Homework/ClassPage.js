import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import Assignment from "./Assignment"
import DatePicker from "react-datepicker"
import moment from "moment"
import styles from "../../assets/styles/homework.css"
import "react-datepicker/dist/react-datepicker-cssmodules.css"


@inject("HomeworkStore")
@observer    
export default class ClassPage extends Component {

    state = {
        addingAssignment: false,
        selectedModule: "",
        title: "",
        githubLink: "",
        deadline: moment().format("YYYY-MM-DD")
    }

    async componentWillMount() {
        const { getActiveGroups, fetchAllData } = this.props.HomeworkStore
        await getActiveGroups()
        fetchAllData(this.props.studentClass)   
    }

    handleInputChange = (value, field) => {
        this.setState({
            [field]: value
        })
    }

    toggleAddAssignment = () => {
        this.setState({
            addingAssignment: !this.state.addingAssignment
        })
    }

    addAssignment = () => {
        const { selectedModule, title, githubLink, deadline } = this.state
        if (selectedModule && title && githubLink && deadline) {
            this.props.HomeworkStore.addAssignment(selectedModule, title, githubLink, deadline)
            this.toggleAddAssignment()
        }
    }

    render() {
        const { studentClass } = this.props
        const { modules, assignments } = this.props.HomeworkStore
        const latestAssignments = assignments.slice(0, 2)
        const { addingAssignment, selectedModule, title, githubLink, deadline } = this.state
        
        return (
            <div className={styles.classPage}>
                <h1>Class {studentClass.substr(5)}</h1>
                <section className={styles.addAssignmentForm}>
                    {addingAssignment
                        ? <div>
                            <select className={styles.selectModule} value={selectedModule} onChange={e => this.handleInputChange(e.target.value, "selectedModule")}>
                                <option value="" disabled hidden>Select module</option>    
                                {modules.map(module => (
                                    <option key={module.id} value={module.name}>{module.name}</option>
                                ))}
                            </select>
                            <input type="text"
                                className={styles.title}    
                                value={title}
                                placeholder="Homework title . . ."
                                onChange={e => this.handleInputChange(e.target.value, "title")}
                            />
                            <input type="text"
                                className={styles.githubLink}    
                                value={githubLink}
                                placeholder="Github link . . ."
                                onChange={e => this.handleInputChange(e.target.value, "githubLink")}
                            />
                            <DatePicker
                                className={styles.deadline}     
                                value={deadline}
                                onChange={date => this.handleInputChange(moment(date).format("YYYY-MM-DD"), "deadline")}
                            />
                            <button className={styles.saveButton} onClick={this.addAssignment}>Save</button>
                            <button className={styles.cancelButton} onClick={this.toggleAddAssignment}>Cancel</button>
                        </div>
                        : <button onClick={this.toggleAddAssignment} className={styles.newAssignment}>New Assignment</button>
                    }
                </section>    

                <section className={styles.assignmentsContainer}>
                    {latestAssignments.map(assignment => (
                        <Assignment
                            key={assignment.id}
                            id={assignment.id}
                            module={assignment.module_name}
                            title={assignment.title}
                            deadline={assignment.deadline}
                            instructions={assignment.assignment_link}
                        />
                    ))}
                </section>    
            </div>           
        )
    }
}
