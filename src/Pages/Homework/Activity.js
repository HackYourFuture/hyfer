import React, { Component } from "react"
import { inject, observer } from "mobx-react"
//import moment from "moment"


@inject("HomeworkStore")
@observer   
export default class Activity extends Component {

    render() {
        const { currentGroupReviews } = this.props.HomeworkStore

        return (
            <section>
                <h2>Activity</h2>    
                {currentGroupReviews.map((review, i) => (
                    <div key={review.reviewer + i}>
                        <h4>{review.reviewer} reviewed {review.reviewee}</h4>
                        <p>{review.comments}</p>
                    </div>
                ))} 
        </section>        
        )
    }
}
