const email = "student-email@email.com"
const avatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8nQvB-OC1ZaSZDN1dhyhyoysd0bDUM20JqcDg2uzc2Nc63smYtA"
const githubLink = "https://github.com/HackYourFuture"


export const studentClasses = ["class12", "class13", "class14", "class15"]


export const students = {
    class12: [
        { name: "Nagham", avatar, email },
        { name: "Talal", avatar, email },
        { name: "Chileshe", avatar, email },
        { name: "Jawhar", avatar, email }
    ],
    class13: [
        { name: "Student-1", avatar, email },
        { name: "Student-2", avatar, email },
        { name: "Student-3", avatar, email },
    ],
    class14: [
        { name: "Student-A", avatar, email },
        { name: "Student-B", avatar, email },
        { name: "Student-C", avatar, email },
    ],
    class15: [
        { name: "Student-X", avatar, email },
        { name: "Student-Y", avatar, email },
        { name: "Student-Z", avatar, email }
    ]
}


export const submissions = {
    class12: [
        { submitter: "Nagham", githubLink }
    ],
    class13: [
        { submitter: "Student-1", githubLink }
    ],
    class14: [
        { submitter: "Student-B", githubLink }
    ],
    class15: [
        { submitter: "Student-Y", githubLink }
    ]
}


export const reviews = {
    class12: [
        { reviewer: "Jawhar", reviewee: "Talal", comments: "Well done!" },
        { reviewer: "Talal", reviewee: "Chileshe", comments: "Your css needs work" }
    ],
    class13: [
        { reviewer: "Student-1", reviewee: "Student-2", comments: "Good job!" }
    ],
    class14: [
        { reviewer: "Student-B", reviewee: "Student-C", comments: "Keep it up!" }
    ],
    class15: [
        { reviewer: "Student-Y", reviewee: "Student-Z", comments: "You did a great job!" }
    ]
}
