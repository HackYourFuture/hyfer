import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import moment from "moment"
import styles from "../../assets/styles/homework.css"


@inject("HomeworkStore")
@observer   
export default class Review extends Component {

    render() {
        const { currentUser, students } = this.props.HomeworkStore
        const { reviewerId, comments, date } = this.props

        //currentUser is separate entry in db
        const reviewer = students.filter(student => student.id === reviewerId)[0] || currentUser

        return (
            <div className={styles.review}>
                <h6 className={styles.timestamp}>{moment(date).format("LLL")}</h6>
                <h3>{reviewer.username}</h3>
                <img src={reviewer.avatarUrl} alt={reviewer.username} />
                <p>{comments}</p>        
            </div>        
        )
    }
}
