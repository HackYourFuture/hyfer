import moment from "moment"


const email = "student-email@email.com"
const avatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8nQvB-OC1ZaSZDN1dhyhyoysd0bDUM20JqcDg2uzc2Nc63smYtA"

const dateDue = new moment()
const githubLink = "https://github.com/HackYourFuture/HTML-CSS/blob/master/Week1/MAKEME.md"


export const studentClasses = {
    class12: {
        students: [
            { name: "Nagham", avatar, email },
            { name: "Talal", avatar, email },
            { name: "Chileshe", avatar, email },
            { name: "Jawhar", avatar, email }
        ],

        homeworkList: [
            {
                title: "React wk5 - Async Actions",
                dateDue,
                githubLink,
                submissions: [
                    { submitter: "Nagham", githubLink: "hhewgeisw" }
                ],
                reviews: [
                    { reviewer: "Nagham", reviewee: "Talal", comments: "Good job!" },
                    { reviewer: "Talal", reviewee: "Chileshe", comments: "Your css needs work" }

                ]
            },
            {
                title: "React wk4 - MobX",
                dateDue,
                githubLink,
                submissions: [
                    { submitter: "Talal", githubLink: "hhewgeisw" }
                ],
                reviews: [
                    { reviewer: "Chileshe", reviewee: "Jawhar", comments: "Keep it up" }
                ]
            }
        ]
    },


    class13: {
        students: [
            { name: "Student-1", avatar, email },
            { name: "Student-2", avatar, email },
            { name: "Student-3", avatar, email },
        ],

        homeworkList: [
            {
                title: "Databases wk3 - Authentication",
                dateDue,
                githubLink,
                submissions: [
                    { submitter: "Student-1", githubLink: "hhewgeisw" }
                ],
                reviews: [
                    { reviewer: "Student-1", reviewee: "Student-2", comments: "Good job!" }
                ]
            },
            {
                title: "Databases wk2 - MySQL",
                dateDue,
                githubLink,
                submissions: [
                    { submitter: "Student-2", githubLink: "hhewgeisw" }
                ],
                reviews: [
                    { reviewer: "Student-2", reviewee: "Student-3", comments: "Keep it up" }
                ]
            }
        ]
    },


    class14: {
        students: [
            { name: "Student-A", avatar, email },
            { name: "Student-B", avatar, email },
            { name: "Student-C", avatar, email },
        ],

        homeworkList: [
            {
                title: "Node wk2 - Express",
                dateDue,
                githubLink,
                submissions: [
                    { submitter: "Student-B", githubLink: "hhewgeisw" }
                ],
                reviews: [
                    { reviewer: "Student-B", reviewee: "Student-C", comments: "Keep it up" }
                ]
            },
            {
                title: "Node wk1 - Todo App",
                dateDue,
                githubLink,
                submissions: [
                    { submitter: "Student-C", githubLink: "hhewgeisw" }
                ],
                reviews: [
                    { reviewer: "Student-C", reviewee: "Student-A", comments: "Well done!" }
                ]
            }
        ]
    },


    class15: {
        students: [
            { name: "Student-X", avatar, email },
            { name: "Student-Y", avatar, email },
            { name: "Student-Z", avatar, email }
        ],

        homeworkList: [
            {
                title: "JS1 wk2 - Arrays",
                dateDue,
                githubLink,
                submissions: [
                    { submitter: "Student-Y", githubLink: "jejjejjw" }
                ],
                reviews: [
                    { reviewer: "Student-Y", reviewee: "Student-Z", comments: "Keep it up" }
                ]
            },
            {
                title: "JS1 wk1 - Variables",
                dateDue,
                githubLink,
                submissions: [
                    { submitter: "Student-Z", githubLink: "uueeeem" }
                ],
                reviews: [
                    { reviewer: "Student-Z", reviewee: "Student-X", comments: "Well done!" }
                ]
            }
        ]
    }
}
