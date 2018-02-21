import React from 'react';
import Checkbox from '../../Helpers/Checkbox/Checkbox';
import AttendObs from '../../store/AttendanceStore';
import styles from '../../assets/styles/attendance.css';

export default class StudentWithWeeks extends React.Component{

    componentWillMount = () => {
        this.subscription = AttendObs.subscribe(state => {
            this.setState(state);
        })
    };

    render(){
        return(
            
            this.renderWeeks()
            
        )
    };

    //this function will render check boxes for each student base on weeks
    renderWeeks(){

        const { allHistory, keys } = this.props;

        for(var i = 0; i < keys.length; i++){

            var studentHistory = allHistory[keys[i]];
            
        };

        const weeks = studentHistory.map((week, duration) =>
             
            <div className={styles.Checkboxes} key={duration}>
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
            return true
        } else {return false}
    }

    getIsAttendanceChecked = (id, student) => {
    
        if (this.props.allHistory[student][id].attendance === 1) {
            return true
        } else {return false}
    }

};