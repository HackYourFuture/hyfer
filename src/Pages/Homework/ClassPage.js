import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import AddHomework from "./AddHomework"
import Submission from "./Submission"
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
        deadline: moment().format("DD-MM-YYYY")
    }

    async componentWillMount() {
        const {
            setCurrentGroup,
            getActiveGroups,
            getCurrentUser,
            getStudents,
            getActiveModules
        } = this.props.HomeworkStore

        setCurrentGroup(this.props.studentClass)
        await getActiveGroups()
        getStudents()
        getCurrentUser()
        getActiveModules()
    }

    handleInputChange = (value, field) => {
        this.setState({
            [field]: value
        })
    }

    render() {
        const { studentClass } = this.props
        const { modules } = this.props.HomeworkStore
        const { selectedModule, title, deadline } = this.state
        
        return (
            <div className={styles.classPage}>
                <h1>Class {studentClass.substr(5)}</h1>

                <section>
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
                    <DatePicker
                        value={deadline}
                        onChange={date => this.handleInputChange(moment(date).format("DD-MM-YYYY"), "deadline")}
                    />
                </section>


                <AddHomework />  
                
                <section className={styles.submissionsContainer}>
                    
                    <Submission />
                        
                    <div className={styles.reviewsContainer}>
                        <Activity />
                    </div> 

                </section>    
            </div>           
        )
    }
}
