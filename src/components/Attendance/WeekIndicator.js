import React from 'react';
import {
    moduleInfoStore,
    HISTORY_CHANGED
} from '../../store';

export default class WeekIndicator extends React.Component {

    state = {

    }

    componentDidMount = () => {

        // gtting data when component is mounted
        moduleInfoStore.subscribe(mergedData => {
            if (mergedData.type === HISTORY_CHANGED) {
                this.setState({
                    history: mergedData.payload.history,
                    duration: mergedData.payload.duration,
                    students: mergedData.payload.students,
                })                
            }
        })
    }

    render(){

        return this.renderWeeks()
        
    }

    renderWeeks(){

        const { allHistory, students, duration } = this.state;
        console.log(this.state)

        for(var i = 0; i < students.length; i++){
            var studentHistory = allHistory[students[i]];
        };

        const weeks = studentHistory.map((week, duration) =>
             
            <div key={duration}>
                <span>week {week}</span>
            </div>
        ) 
        return weeks;  
    };
             
}


