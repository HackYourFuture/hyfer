import React from 'react';
import styles from '../../assets/styles/attendance.css';

export default class Checkbox extends React.Component{

    handleClick = event => {
        event.preventDefault();
    };

    render(){
        return(
            <div className={styles.Checkbox}>
                <label>
                    <input type='checkBox' className={this.props.className}
                     onChange={this.props.onChange}
                    />
                    <span>HomWork</span>
                </label>

                <label>
                    <input type='checkBox' className={this.props.className}
                     onChange={this.props.onChange}
                    />
                    <span>Attendance</span>
                </label>
            </div>
        );
    };
};