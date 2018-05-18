import React, { Component } from 'react'
import classes from './classRowComp.css'

const token = localStorage.getItem("token")

export default class ClassRowComp extends Component {

    handleClassArchive = async (id) => {
        const group = this.props.groupsWithIds.filter(group => group.group_name.replace(/ /g, '').substr(5) === id)

        if (window.confirm(`Are you sure you want to delete ${group[0].group_name}?`)) {
            try {
                await fetch(`http://localhost:3005/api/groups/${group[0].id}`, {
                    method: 'PATCH',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    },
                    body: JSON.stringify({
                        'archived': 1
                    })
                })
                window.location.reload()
            } catch (error) {
                console.log(error)
                throw new Error('Problem with Server :  PATCH DATA')
            }
        }  
    }  
    
    render() {
        const { classId, height } = this.props
    return (
      <div style={{ height: height + 'px' }} className={classes.container}>
            <button onClick={() => this.handleClassArchive(classId)} className={this.props.classId && classes.groupId}>{classId}</button>
      </div>
    )
  }
}
