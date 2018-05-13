import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import moment from "moment"


@inject("HomeworkStore")
@observer   
export default class Activity extends Component {

    render() {
        const { reviews, students } = this.props.HomeworkStore

        return (
            <section>
                <h2>Activity</h2>    
                {reviews.map(review => (
                    <div key={review.id}>
                        {students.map(student => (
                            review.reviewer_id === student.id
                                ? <span key={review.reviewer_id}>{student.username}</span>
                                : null
                        ))}
                        reviewed
                        {students.map(student => (
                            review.submitter_id === student.id
                                ? <span key={review.submitter_id}>{student.username}</span>
                                : null
                        ))}
                        <h6>{moment(review.date).format("MMMM Do YYYY, h:mm")}</h6>
                        <p>{review.comments}</p>
                    </div>
                ))} 
        </section>        
        )
    }
}
