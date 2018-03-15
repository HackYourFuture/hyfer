import React from 'react';
import styles from '../../assets/styles/attendance.css';

export default class WeekIndicator extends React.Component {

    render(){
        return this.renderWeeks();
    }

    renderWeeks(){
        const { duration, students, history, repoName } = this.props;  
        if ( duration !== null && students.length !== 0 && repoName !== "NOREPO" ) {
            for( var i = 0; i < students.length; i++ ){
                var studentHistory = history[students[i]];
            };
            const weeks = studentHistory.map((week, duration) =>
                <div className={styles.week_indicator} key={duration}><h3>week {duration + 1}</h3></div>
            ) 
            return weeks; 
        } else return null;
    }        
}
