import React from 'react';
import StudentWithWeeks from './StudentWithWeeks';
import styles from '../../assets/styles/attendance.css';
import AttendObs from '../../store/AttendanceStore';

export default class Attendance extends React.Component{

    componentWillMount = () => {
        this.subscription = AttendObs.subscribe(state => {
            this.setState(state);
        })
    };

    componentDidMount = () => {
        this.getHistory();
    };

    componentWillUnmount() {
        AttendObs.unsubscribe()
    };

    render(){
        return(
           this.renderAttendant()
        );
    };

    renderAttendant(){

        const obj = AttendObs.get('history')
        const keys = AttendObs.get('keys');

        //this will render students list 
        const user = keys.map((student) =>
            <div className={styles.Attendant} key={student}>
                <div className={styles.AttendantName}>
                    <h3>{student}</h3>
                </div>
                <StudentWithWeeks student={student}
                obj={obj}
                keys={keys}/>
            </div>
        );
        return user;
    };

	getHistory = () => {
        let baseUrl = 'http://localhost:3005/api/history/';
        let sundays = {sundays: ["2016/11/06", "2016/11/13", "2016/11/20"]};
        let moduleId = 751;
        let classId = 45;

        fetch(`${baseUrl}${moduleId}/${classId}`, {
            method: 'PATCH', 
            body: JSON.stringify(sundays),
            headers: {
            'Content-Type': 'application/json',
            }, 
        })
        .then(response => response.json())
        .then(response => {
            const keys = Object.keys(response)
            this.setHistory(response);
            this.setKeys(keys);
        })
        .catch(err => console.log(err))
    };

    setHistory(history){
        AttendObs.setState({
            history: history,
        });
    };

    setKeys(keys){
        AttendObs.setState({
            keys: keys,
        });
    };
};

 