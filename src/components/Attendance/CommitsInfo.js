import React, { Component } from 'react';
import style from '../../assets/styles/attendance.css';


export default class CommitsInfo extends Component {
    render() {

        console.log('here')
        let content = null
        if (this.props.commits) {
            console.log('if')
            const uniqNames = new Set()
            const commits = this.props.commits.filter(commit => {
                if (!uniqNames.has(commit.name)) {
                    uniqNames.add(commit.name)
                    return true
                }
                return false
            })
            content = commits.map(commit => (
                <div className={style.commiters}>
                    <tr key={commit.key}>
                        <td>{commit.name}</td>
                        <td>{commit.email}</td>
                        <td>{commit.date}</td>
                    </tr>

                </div>
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

