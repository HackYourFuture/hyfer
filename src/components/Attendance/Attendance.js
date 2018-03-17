import React from 'react';
import StudentWithWeeks from './StudentWithWeeks';
import WeekIndicator from './WeekIndicator';
import styles from '../../assets/styles/attendance.css';
import Notifications, {notify} from 'react-notify-toast';
import {
    moduleInfoStore,
    HISTORY_CHANGED
} from '../../store';

const stack = [];

export default class Attendance extends React.Component{

    state = {
        edit_Mode: false,
        repoName: null,
        group_name: null,
        history: null,
        students: null,
        duration: null,
    };

    // Subscribing to the module info store for getting "history"
    componentDidMount = () => {
        // gtting data when component is mounted
        moduleInfoStore.subscribe(mergedData => {
            if (mergedData.type === HISTORY_CHANGED) {
                this.setState({
                    history: mergedData.payload.history,
                    duration: mergedData.payload.duration,
                    group_name: mergedData.payload.group_name,
                    repoName: mergedData.payload.repoName,
                    students: mergedData.payload.students,
                })                
            }
        })

        // getting selected module update from timeline component
        const { history, students, duration, repoName, group_name } = this.props;
        this.setState({
            repoName: repoName,
            group_name: group_name,
            history: history,
            students: students,
            duration: duration,
        })
    };

    render(){

        const { history, students, duration, repoName, group_name } = this.state;
        let title = null;
        let content = null;
        let buttons = null;
        if (repoName === "NOREPO") {
            content = (<h2 className={styles.message}>Oops! there is no History.</h2>)
        } else if (students === null || repoName === undefined) {
            content = (<h2 className={styles.message}>Please choose a module</h2>)
        } else if (students.length === 0 ){
            content = (<h2 className={styles.message}>There is no student in this class.</h2>)
        } else {
            content= (
            students.map((student) =>
            <div className={styles.Attendant} key={student}>
                <div className={styles.AttendantName}>
                    <h3>{student}</h3>
                </div>
                <div className={styles.checkboxes}>
                    <StudentWithWeeks 
                    allHistory={history}
                    duration={duration}
                    onChange={(event) => { this.handleCheckboxChange( student, event )}}
                    student={student}
                    students={students}
                    />
                </div>
            </div>)
            )

            title = (
                <div className={styles.Title}>
                    <h3 className={styles.Title_inner}>Attendance - {repoName.charAt(0).toUpperCase() + repoName.slice(1)}</h3>
                </div>
            )
    
            buttons = (
                <div className={styles.buttons} >
                    <button className={styles.button_save}
                        disabled={!this.state.edit_Mode}
                        name="save"
                        onClick={this.onSave}
                    >Save</button>
                    <button className={styles.button_undo}
                        disabled={!this.state.edit_Mode}
                        name="undo"
                        onClick={this.undo}
                    >Undo</button>
                    <button className={styles.button_cancel}
                        disabled={!this.state.edit_Mode}
                        name="cancel"
                        onClick={this.onCancel}
                    >Cancel</button>
                </div>
            )
        };

        return(
            <div>
                {title}
                <div className={styles.wrapper}>
                    <div className={styles.group_name}>
                        <h3 className={styles.group_name_inner}>{group_name}</h3>
                        <WeekIndicator
                        duration={duration}
                        students={students}
                        history={history}
                        repoName={repoName}
                        />
                    </div>
                    <div className={styles.content_wrapper}>
                        {content}
                    </div>
                    {buttons}
                </div>
                <Notifications />
            </div>
        )
    };

    handleCheckboxChange = ( student, event ) => {
        const week = event.target.id;
        const name = event.target.name; //attendance or homework
        // edit_mode will active the save and cancel buttons
        this.setState({
            edit_Mode : true,
        })
        stack.push(student, week, name);
        this.makeChange(student, week, name);
    }

    makeChange = (student, week, name) => {
        const { history } = this.state;
        const changeValue=(v)=>{
            if (v === 0) {
                return 1
            } else if (v === 1) {
                return 0
            }
        };
        // change in history object
        history[student][week][name] = changeValue(history[student][week][name])
        this.setState({
            history: history,
        })
    };

    onSave = () => {
        const body = this.state.history;
        let BASE_URL = 'http://localhost:3005/api/history';
        fetch(BASE_URL , {
            method: 'POST', 
            body: JSON.stringify(body),
            headers: {
            'Content-Type': 'application/json',
            }, 
          })
        .then(response => response.json())
        .then(notify.show('Your changes are successfully Saved !', 'success'))
        .catch(err => console.log(err))
        this.setState({
            edit_Mode: null,
        }) 
    };

    onCancel = () => {
        for (let i = 0; i < stack.length; i++) { 
            this.undo();
        };
        notify.show('Your changes have been cancelled !', 'warning');
    }

    undo = () => {
        const toUndo = stack.slice(-3);
        stack.splice(-3, 3);
        const student = toUndo[0];
        const week = toUndo[1];
        const name = toUndo[2];
        if ( stack.length === 0 ) {
            this.setState({
                edit_Mode: null,
            })
        };
        this.makeChange(student, week, name);
    };
};