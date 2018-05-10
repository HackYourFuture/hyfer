import React, { Component } from "react"
import { Provider, inject, observer } from "mobx-react"
import AddHomework from "./AddHomework"
import Submission from "./Submission"
import Reviews from "./Reviews"
import HomeworkStore from "../../store/HomeworkStore"
import styles from "../../assets/styles/homework.css"

@inject("HomeworkStore")
@observer    
export default class ClassPage extends Component {

    componentWillMount() {
        this.props.HomeworkStore.getActiveGroups()
        this.props.HomeworkStore.getCurrentUser()
        this.props.HomeworkStore.getStudents()
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
        const { activeGroups, students, submissions, reviews } = this.props.HomeworkStore

        const groupStudents = students.filter(student => student.group === this.props.studentClass)
        const groupSubmissions = submissions.filter(submission => submission.group === this.props.studentClass)
        const groupReviews = reviews.filter(review => review.group === this.props.studentClass)



        return (
            <div className={styles.classPage}>
                <div className={styles.navBar}>
                    {activeGroups.map(group => (
                        <a key={group} href={"/homework/" + group}>
                            <button>Class {group.substr(5)}</button>
                        </a>
                    ))}
                </div>

                <AddHomework addSubmission={this.addSubmission} />  
                
                <section className={styles.submissionsContainer}>
                    <Submission
                        students={groupStudents}
                        submissions={groupSubmissions}
                        addReview={this.addReview}
                        requestReview={this.requestReview}
                    />
                        
                    <div className={styles.reviewsContainer}>
                        <Reviews reviews={groupReviews}/>
                    </div> 
                </section>    
            </div>
                    
        )
    }
}
