import React from 'react';
import StudentWithWeeks from './StudentWithWeeks';
import styles from '../../assets/styles/attendance.css';
//import AttendObs from '../../store/AttendanceStore';
import {
    moduleInfoStore,
    HISTORY_CHANGED
} from '../../store';

const stack = [];

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
                    <button className={styles.button}
                     disabled={!this.state.edit_Mode}
                     name="save"
                     onClick={this.onSave}
                    >
                    <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px"
                    viewBox="0 0 49 49" >
                    <rect x="27.5" y="5" width="6" height="10"/>
                    <path d="M39.914,0H0.5v49h48V8.586L39.914,0z M10.5,2h26v16h-26V2z M39.5,47h-31V26h31V47z"/>
                    <path d="M13.5,32h7c0.553,0,1-0.447,1-1s-0.447-1-1-1h-7c-0.553,0-1,0.447-1,1S12.947,32,13.5,32z"/>
                    <path d="M13.5,36h10c0.553,0,1-0.447,1-1s-0.447-1-1-1h-10c-0.553,0-1,0.447-1,1S12.947,36,13.5,36z"/>
                    <path d="M26.5,36c0.27,0,0.52-0.11,0.71-0.29c0.18-0.19,0.29-0.45,0.29-0.71s-0.11-0.521-0.29-0.71c-0.37-0.37-1.04-0.37-1.41,0
                       c-0.19,0.189-0.3,0.439-0.3,0.71c0,0.27,0.109,0.52,0.29,0.71C25.979,35.89,26.229,36,26.5,36z"/>
                    </svg></button>

                    <button className={styles.button}
                     disabled={!this.state.edit_Mode}
                     name="cancel"
                     onClick={this.undo}
                    >
                    <svg  x="0px" y="0px" viewBox="0 0 512 512" >
                        <path d="M142.716,293.147l-94-107.602l94-107.602c7.596-8.705,6.71-21.924-1.995-29.527c-8.705-7.596-21.917-6.703-29.527,1.995
			            L5.169,171.782c-6.892,7.882-6.892,19.65,0,27.532l106.026,121.372c4.143,4.729,9.94,7.157,15.771,7.157
			            c4.883,0,9.786-1.702,13.755-5.169C149.427,315.071,150.319,301.852,142.716,293.147z"/>
		                <path d="M359.93,164.619H20.926C9.368,164.619,0,173.986,0,185.545c0,11.558,9.368,20.926,20.926,20.926H359.93
			            c60.776,0,110.218,49.441,110.218,110.211S420.706,426.893,359.93,426.893H48.828c-11.558,0-20.926,9.368-20.926,20.926
			            c0,11.558,9.368,20.926,20.926,20.926H359.93c83.844,0,152.07-68.219,152.07-152.063S443.781,164.619,359.93,164.619z"/>
                    </svg></button>

                    <button className={styles.button}
                     disabled={!this.state.edit_Mode}
                     name="cancel"
                     onClick={this.onCancel}
                    >
                    <svg  x="0px" y="0px" viewBox="0 0 51.976 51.976">
	                    <path d="M44.373,7.603c-10.137-10.137-26.632-10.138-36.77,0c-10.138,10.138-10.137,26.632,0,36.77s26.632,10.138,36.77,0
		                C54.51,34.235,54.51,17.74,44.373,7.603z M36.241,36.241c-0.781,0.781-2.047,0.781-2.828,0l-7.425-7.425l-7.778,7.778
		                c-0.781,0.781-2.047,0.781-2.828,0c-0.781-0.781-0.781-2.047,0-2.828l7.778-7.778l-7.425-7.425c-0.781-0.781-0.781-2.048,0-2.828
		                c0.781-0.781,2.047-0.781,2.828,0l7.425,7.425l7.071-7.071c0.781-0.781,2.047-0.781,2.828,0c0.781,0.781,0.781,2.047,0,2.828
		                l-7.071,7.071l7.425,7.425C37.022,34.194,37.022,35.46,36.241,36.241z"/>
                    </svg></button>
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
        .catch(err => console.log(err))

        this.setState({
            edit_Mode: null,
        }) 
    };

    onCancel = () => {

        for (let i = 0; i < stack.length; i++) { 
            this.undo();
        };
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