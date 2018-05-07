import React, { Component } from "react"
import AddHomework from "./AddHomework"
import Submission from "./Submission"
import Reviews from "./Reviews"
import { studentClasses, students, submissions, reviews } from "../../store/HomeworkStore"
import styles from "../../assets/styles/homework.css"


export default class ClassPage extends Component {

    state = {
        currentUser: {},
        students: students[this.props.studentClass],
        submissions: submissions[this.props.studentClass],
        reviews: reviews[this.props.studentClass]    
    }

    async componentWillMount() {

        const CURRENT_USER_INFO_URL = 'http://localhost:3005/api/user'
        const token = localStorage.getItem("token")

        const res = await fetch(CURRENT_USER_INFO_URL, {
            credentials: "same-origin",
            headers: {
                "Authorization": "Bearer " + token,
            }
        })       
        const userData = await res.json()
        const currentUser = {
            name: userData.full_name || userData.username,
            email: userData.email,
            avatar: `https://avatars.githubusercontent.com/${userData.username}`
        }

        this.setState({
            currentUser,
            students: [...this.state.students, currentUser]
        })
    }

    addSubmission = (githubLink) => {
        this.setState({  
            submissions: [
                ...this.state.submissions,
                { submitter: this.state.currentUser.name, githubLink }
            ]           
        })
    }

    requestReview = (reviewer, reviewee) => {
        // *** send email to reviewer - 
        //"Your review has been requested on {reviewee}'s homework"
    }

    addReview = (reviewee, comments) => {
        this.setState({
            reviews: [
                ...this.state.reviews,
                { reviewer: this.state.currentUser.name, reviewee, comments }
            ]            
        })
    }

    render() {
        const { students, submissions, reviews } = this.state

        return (
            <div className={styles.classPage}>
                <div className={styles.navBar}>
                    {studentClasses.map(studentClass => (
                        <a key={studentClass} href={"/homework/" + studentClass}>
                            <button>Class {studentClass.substr(5)}</button>
                        </a>
                    ))}
                </div>

                <AddHomework addSubmission={this.addSubmission} />  
                
                <section className={styles.submissionsContainer}>
                    <Submission
                        students={students}
                        submissions={submissions}
                        addReview={this.addReview}
                        requestReview={this.requestReview}
                    />
                         
                    <div className={styles.reviewsContainer}>
                         <Reviews reviews={reviews}/>
                    </div> 
                </section>    
            </div>
        )
    }
}
