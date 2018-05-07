import React, { Component } from "react"
import moment from "moment"


export default class Reviews extends Component {

    render() {
        const { reviews } = this.props
        return (
            <section>
                <h2>Reviews</h2>    
                {reviews.map((review, i) => (
                    <div key={review.reviewer + i}>
                        <h4>{review.reviewer} reviewed {review.reviewee}</h4>
                        <p>{review.comments}</p>
                    </div>
                ))} 
        </section>        
        )
    }
}
