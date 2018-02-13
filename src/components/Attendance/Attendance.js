import React from 'react';
import StudentWithWeeks from './StudentWithWeeks';
import styles from '../../assets/styles/attendance.css';

export default class Attendance extends React.Component{
    
    state = {
        history: [],
        keys: [],
    }; 

    componentDidMount = () => {
        this.getHistory();
    };

    render(){
        return(
           this.renderAttendant()
        );
    };

    renderAttendant(){

        const obj = this.state.history
        const keys = this.getKeys();

        //this will render students list 
        const user = this.state.keys.map((student) =>
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

    //this fetch with patch method will get the history from api 
    //later we need a function to get the actual syndays , module-id and class-id
    getHistory = () => {
        var sundays = {sundays: ["2016/11/06", "2016/11/13", "2016/11/20"]};

        fetch('http://localhost:3005/api/history/751/45', {
            method: 'PATCH', 
            body: JSON.stringify(sundays),
            headers: {
            'Content-Type': 'application/json',
            }, 
        })
        .then(response => response.json())
        .then(response => {
            const keys = Object.keys(response)
            this._students = {}
            for (const student of keys) {
            for (const val of response[student]) {
                const obj = {
                _full_name: val.full_name,
                _date: val.date,
                _attendance: val.attendance,
                _homework: val.homework
                }
            }
            }
            this.setHistory(response);
            this.setKeys(keys);
        })
        .catch(err => console.log(err))
    };

    setHistory(history){
        this.setState({
            history: history,
        });
    };

    
    setKeys(keys){
        this.setState({
            keys: keys,
        });
    };

    getKeys(){
        const keys = this.state.keys
        return keys;
    };
};

 