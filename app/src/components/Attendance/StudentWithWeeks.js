import React from 'react';
import Checkbox from '../../Helpers/Checkbox/Checkbox';
import styles from '../../assets/styles/attendance.css';

export default class StudentWithWeeks extends React.Component{

    render(){
        return this.renderWeeks();
    }

    //this function will render check boxes for each student base on weeks
    renderWeeks(){
        const { allHistory, students } = this.props;
        for(var i = 0; i < students.length; i++){
            var studentHistory = allHistory[students[i]];
        };
        const weeks = studentHistory.map((week, duration) =>
             
            <div className={styles.week_checkboxes} key={duration}>
                <Checkbox
                onChange={(duration)=> this.props.onChange( duration, this.props.student)}
                id={duration}
                homeworkChecked={(id)=>this.getIsHomeworkChecked(id , this.props.student)}
                AttendanceChecked={(id)=>this.getIsAttendanceChecked(id , this.props.student)}
                />
            </div>
        ) 
        return weeks;  
    };

    getIsHomeworkChecked = (id, student) => {
        if (this.props.allHistory[student][id].homework === 1) {
            return true;
        } else {return false}
    };

    getIsAttendanceChecked = (id, student) => {
        if (this.props.allHistory[student][id].attendance === 1) {
            return true;
        } else {return false}
    };
};