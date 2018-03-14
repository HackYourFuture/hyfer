import React from 'react';
import styles from '../../assets/styles/attendance.css';

export default class Checkbox extends React.Component{

    render(){
        return(
            <div className={styles.checkbox}>
                    <input type='checkBox' className={styles.homework}
                     checked={this.props.homeworkChecked(this.props.id, this.props.student)}
                     onChange={this.props.onChange}
                     id={this.props.id}
                     name={'homework'}
                    />

                    <input type='checkBox' className={styles.attendance}
                     onChange={this.props.onChange}
                     checked={this.props.AttendanceChecked(this.props.id, this.props.student)}
                     id={this.props.id}
                     name={'attendance'}
                    />
            </div>
        );
    };
};

