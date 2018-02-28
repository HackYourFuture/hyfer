import React from 'react';
import StudentWithWeeks from './StudentWithWeeks';
import styles from '../../assets/styles/attendance.css';
//import AttendObs from '../../store/AttendanceStore';
import {
    moduleInfoStore,
    HISTORY_CHANGED
} from '../../store';

export default class Attendance extends React.Component{

    state = {
        edit_Mode: false,
        repoName: null,
        group_id: null,
        group_name: null,
        running_module_id: null,
        history: null,
        keys: null,
        duration: null,
    };

    // Subscribing to the module info store for getting "history"
    componentDidMount = () => {
        moduleInfoStore.subscribe(mergedData => {
            if (mergedData.type === HISTORY_CHANGED) {
                this.setState({
                    history: mergedData.payload.history,
                    keys: mergedData.payload.keys,
                    duration: mergedData.payload.duration,
                    group_id: mergedData.payload.group_id,
                    group_name: mergedData.payload.group_name,
                    repoName: mergedData.payload.repoName,
                    running_module_id: mergedData.payload.running_module_id,
                })
            }
        })       
    };

    render(){

        const { history, keys, duration, repoName, group_name } = this.state;
        let title = null;
        let content = null;
        let buttons = null;
        if (repoName === "NOREPO") {
            content = (<h3 className={styles.message}>Oops! there is no History</h3>)
        } else if (keys == null) {
            content = (<h3 className={styles.message}>please choose a module</h3>)
        } else if (history.length === 0 ){
            content = (<h3 className={styles.message}>there is no history for this module</h3>)
        } else {
            content= (
            keys.map((student) =>
            <div className={styles.Attendant} key={student}>
                <div className={styles.AttendantName}>
                    <h3>{student}</h3>
                </div>
                <StudentWithWeeks 
                allHistory={history}
                keys={keys}
                duration={duration}
                onChange={(event) => { this.handleCheckboxChange( student, event )}}
                student={student}
                />
            </div>)
            )

            title = (
                <div className={styles.Title}>
                    <h3>Attendance in {group_name} of {repoName}</h3>
                </div>
            )

            buttons = (
                <div className={styles.buttons} >
                    <button className={styles.save}
                     disabled={!this.state.edit_Mode}
                     name="save"
                     onClick={this.onSave}
                    >save</button>

                    <button className={styles.cancel}
                     disabled={!this.state.edit_Mode}
                     name="cancel"
                     onClick={this.onCancel}
                    >cancel</button>
                </div>
            )
        };

        return(
            <div>
                {title}
                {content}
                {buttons}
            </div>
        )
    };

    handleCheckboxChange = ( student, event ) => {

        const { history } = this.state
        const week = event.target.id;
        const name = event.target.name; //attendance or homework
        // edit_mode will active the save and cancel buttons
        this.setState({
            edit_Mode : true,
        })

        const changeValue=(v)=>{
            if (v === 0) {
                return 1
            } else if (v === 1) {
                return 0
            }
        }

        // change in history object
        history[student][week][name] = changeValue(history[student][week][name])
    }

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
          .then(response => {console.log(response)})
          .catch(err => console.log(err))

        this.onCancel()  
    }

    onCancel = () => {
        this.setState({edit_Mode: false})
    }
};