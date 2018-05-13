import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import HomeworkItem from "./HomeworkItem"
import Activity from "./Activity"
import DatePicker from "react-datepicker"
import moment from "moment"
import styles from "../../assets/styles/homework.css"
import "react-datepicker/dist/react-datepicker-cssmodules.css"


@inject("HomeworkStore")
@observer    
export default class ClassPage extends Component {

    state = {
        settingHomework: false,
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

    toggleSetHomework = () => {
        this.setState({
            settingHomework: !this.state.settingHomework
        })
    }

    setHomework = () => {
        const { selectedModule, title, githubLink, deadline } = this.state
        if (selectedModule && title && githubLink && deadline) {
            this.props.HomeworkStore.setHomework(selectedModule, title, githubLink, deadline)
            this.toggleSetHomework()
        }
    }

    render() {
        const { studentClass } = this.props
        const { modules, homework } = this.props.HomeworkStore
        const latestHomework = homework.slice(0, 2)
        const { settingHomework, selectedModule, title, githubLink, deadline } = this.state
        
        return (
            <div className={styles.classPage}>
                <h1>Class {studentClass.substr(5)}</h1>
                {settingHomework
                    ? <section>
                        <select value={selectedModule} onChange={e => this.handleInputChange(e.target.value, "selectedModule")}>
                            {modules.map(module => (
                                <option key={module.id} value={module.name}>{module.name}</option>
                            ))}
                        </select>
                        <input type="text"
                            value={title}
                            placeholder="homework title . . ."
                            onChange={e => this.handleInputChange(e.target.value, "title")}
                        />
                        <input type="text"
                            value={githubLink}
                            placeholder="paste homework link . . ."
                            onChange={e => this.handleInputChange(e.target.value, "githubLink")}
                        />
                        <DatePicker
                            value={deadline}
                            onChange={date => this.handleInputChange(moment(date).format("YYYY-MM-DD"), "deadline")}
                        />
                        <button onClick={this.setHomework}>Save</button>
                        <button onClick={this.toggleSetHomework}>Cancel</button>
                    </section>
                    : <button onClick={this.toggleSetHomework}>Set Homework</button>
                }

                <section className={styles.submissionsContainer}>
                    
                    {latestHomework.map(homework => (
                        <HomeworkItem
                            key={homework.id}
                            id={homework.id}
                            title={homework.title}
                            deadline={homework.deadline}
                        />
                    ))}
                    
                    <div className={styles.reviewsContainer}>
                        <Activity />
                    </div> 

                </section>    
            </div>           
        )
    }
}
