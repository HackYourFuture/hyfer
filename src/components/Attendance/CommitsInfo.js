import React, { Component } from 'react';
import style from '../../assets/styles/attendance.css';


export default class CommitsInfo extends Component {
    render() {
        
        console.log('here')
        let content = null
        if (this.props.commits) {
            console.log('if')
            content = this.props.commits.map(commit => (
                <tr key={commit.key}>
                    <td>{commit.name}</td>
                    <td>{commit.email}</td>

                    <td>{commit.date}</td>
                </tr>
            ))
        } else {
            console.log('else')
            content = null
        }
        return (
            <table >{content}</table>
        )
    }
}

