import React, { Component } from "react"
import moment from "moment"
import AddHomework from "./AddHomework"
import Submission from "./Submission"
import { studentClasses } from "../../store/HomeworkStore"

import styles from "../../assets/styles/homework.css"


export default class ClassPage extends Component {

    state = {
        homeworkList: studentClasses[this.props.studentClass].homeworkList,
        students: studentClasses[this.props.studentClass].students
    }

    addSubmission = (title, submitter, githubLink) => {
        this.setState({
            homeworkList: this.state.homeworkList.map(homework => (
                homework.title === title
                    ?
                    {
                        ...homework,
                        submissions: [...homework.submissions, { submitter, githubLink }]
                    }
                    :
                    homework
            ))
        })
    }

    addReview = (title, reviewer, reviewee, comments) => {
        this.setState({
            homeworkList: this.state.homeworkList.map(homework => (
                homework.title === title
                    ?
                    {
                        ...homework,
                        reviews: [...homework.reviews, { reviewer, reviewee, comments }]
                    }
                    :
                    homework
            ))
        })
    }

    requestReview = (reviewer, title, reviewee) => {
        // *** send email to reviewer - 
        //"Your review has been requested on {reviewee}'s {title} homework"
        console.log("email sent to " + reviewer)
    }

    render() {
        const { homeworkList, students } = this.state
        const activeClasses = Object.keys(studentClasses)


        return (
            <div>
                <div className={styles.navBar}>
                    {activeClasses.map(group => (
                        <a key={group} href={"/homework/" + group}><button>Class {group.substr(5)}</button></a>
                    ))}
                </div>

                <AddHomework students={students}
                    homeworkList={homeworkList}
                    addSubmission={this.addSubmission}
                />    
                <section className={styles.classPage}>
                    {homeworkList.map(homework => (
                        <div key={homework.title} className={styles.hmwrkContainer}>
                            <h2>{homework.title}</h2>
                            <h4>Deadline: {moment(homework.dateDue).format("dddd, MMMM D")}</h4>
                            <a href={homework.githubLink}>Instructions</a>

                            <Submission title={homework.title}
                                students={students}
                                homework={homework}
                                addReview={this.addReview}
                                requestReview={this.requestReview}
                            />
                        </div> 
                    ))}

                    <div className={styles.reviewsContainer}>
                        <h2>Reviews</h2>    
                        {homeworkList.map(homework => (
                            <div key={homework.title} className={styles.hmwrkReview}>
                                <h3>{homework.title}</h3>

                                {homework.reviews.map((review, i) => (
                                    <div key={review.reviewer + i}>
                                        <h4>{review.reviewer} reviewed {review.reviewee}</h4>
                                        <p>{review.comments} </p>
                                    </div>
                                ))}
                            </div>
                        ))} 
                    </div> 
                </section>    
            </div>
        )
    }
}
