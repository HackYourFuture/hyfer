import React, { Component } from 'react';
import style from '../../assets/styles/attendance.css';


export default class CommitsInfo extends Component {
    render() {
        let content = null
        if (this.props.commits) {
            content = this.props.commits.map(commit => (
                <div className={style.commiters}>
                <tr key={commit.key}>
                    <td>{commit.name}</td>
                    <td>{commit.email}</td>

                    <td>{commit.date}</td>
                    </tr>
                    </div>
            ))
        } else {
            content = null
        }
        return (
            <table >{content}</table>
        )
    }
}

