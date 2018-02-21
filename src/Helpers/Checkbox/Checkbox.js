import React from 'react';
import styles from '../../assets/styles/attendance.css';

export default class Checkbox extends React.Component{

    // state={
    //     isChecked: false,
    // }

    // toggleCheckboxChange = event => {
    //     event.preventDefault();
    //     console.log('checkbox clicked')
    //     this.setState({
    //         isChecked: true,
    //     })
    // };

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

    // handletest = event => {

    //     //var name = event.target.name;
    //     this.props.onChange(event.target.name);

    // };
    //burslav copy
    //burslav
    //onChange={() => this.props.onChange(this.props.duration)}
};

