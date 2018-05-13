
import React, { Component } from 'react';


export default class CommitsInfo extends Component {
    render() {
        console.log('here')
        let content = null
        if (this.props.commits) {
            console.log('if')
            content = this.props.commits.map(commit => (
                <li key={commit.key}>
                    <div>{commit.name}</div>
                    <div>{commit.email}</div>
                    <div>{commit.repoName}</div>
                    <div>{commit.date}</div>
                </li>
            ))
        } else {
            console.log('else')
            content = null
        }
        return (
            <ul>{content}</ul>
        )
    }
}