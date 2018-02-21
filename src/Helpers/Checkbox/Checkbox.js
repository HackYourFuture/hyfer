import React from 'react';
import styles from '../../assets/styles/attendance.css';

export default class Checkbox extends React.Component{

    render(){
        return(
            <div className={styles.Checkbox}>
                <label>
                    <input type='checkBox' className={this.props.className}
                     checked={this.props.homeworkChecked(this.props.id, this.props.student)}
                     onChange={this.props.onChange}
                     id={this.props.id}
                     name={'homework'}
                    />
                    <span>HomWork</span>
                </label>

                <label>
                    <input type='checkBox' className={this.props.className}
                     onChange={this.props.onChange}
                     checked={this.props.AttendanceChecked(this.props.id, this.props.student)}
                     id={this.props.id}
                     name={'attendance'}
                    />
                    <span>Attendance</span>
                </label>
            </div>
        );
    };
};

