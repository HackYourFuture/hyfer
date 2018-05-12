import { observable, action, computed, configure, runInAction } from "mobx"
import moment from "moment"
//import { getAllGroupsWithIds, getModulesOfGroup, getAllPossibleModules } from "../util"

//=====================================
const githubLink = "hhdjdjdjd"
const date = moment().format()

const exampleSubmissions = [
    { group: "class12", submitter: "Nagham", githubLink, date },
    { group: "class13", submitter: "Student-1", githubLink, date },
    { group: "class14", submitter: "Student-B", githubLink, date },
    { group: "class15", submitter: "Student-Y", githubLink, date }
]
const exampleReviews = [
    { group: "class12", reviewer: "Talal", reviewee: "Chileshe", comments: "Your css needs work", date },
    { group: "class13", reviewer: "Student-1", reviewee: "Student-2", comments: "Good job!", date },
    { group: "class14", reviewer: "Student-A", reviewee: "Student-B", comments: "Keep it up!", date },
    { group: "class15", reviewer: "Student-Y", reviewee: "Student-X", comments: "You did a great job!", date }
]
//================================================
configure({ enforceActions: true })

const token = localStorage.getItem("token")
const API_Root = "http://localhost:3005/api"


export async function fetchData(dataType) {
    const res = await fetch(`${API_Root}/${dataType}`, {
        credentials: "same-origin",
        headers: {
            "Authorization": "Bearer " + token,
        }
    })
    return await res.json()
}


class HomeworkStore {

    @observable 
    currentUser = {} 

    @observable
    currentGroup = null    
    
    @observable
    activeGroups = []

    @observable
    students = []
    
    @observable
    modules = [] 

    @observable
    homework = []    
    
    @observable
    submissions = [...exampleSubmissions]

    @observable
    reviews = [...exampleReviews]

    @action
    getCurrentUser = async() => {        
        const userData = await fetchData("user") 
        runInAction(() => {
            this.currentUser = {
                name: userData.full_name || userData.username,
                email: userData.email,
                avatar: `https://avatars.githubusercontent.com/${userData.username}`,
                group: null
            }
        }) 
    }

    @action
    setCurrentGroup = (group) => {
        this.currentGroup = group
    }  
    
    @action
    getActiveGroups = async () => {
        const groups = await fetchData("groups")
        runInAction(() => {
            this.activeGroups = groups.filter(group => group.archived === 0)
                .map(group => ({
                    id: group.id,
                    name: group.group_name.replace(/ /g, "").toLowerCase(),
                    startDate: group.starting_date
                }))
        })
    }

    @action
    getStudents = async () => {
        const teams = await fetchData("students")
        const allStudentGroups = teams.filter(team => this.activeGroups.includes(team.teamName))
        runInAction(() => {
            this.students = allStudentGroups
        })   
    }

    @action
    getActiveModules = async () => {
        const activeModules = await fetchData("modules/active")
        runInAction(() => {
            this.modules = activeModules
        })
    }    

    @action
    addSubmission = (gitHubLink) => {
        const newSubmission = {
            group: this.currentGroup,
            gitHubLink,
            submitter: this.currentUser.name
        }
        this.submissions.push(newSubmission)
    }

    @action
    requestReviewer = (reviewee, assignedReviewer) => {
        // send email to reviewer
        console.log("email sent to", assignedReviewer)
    }  

    @action
    addReview = (reviewee, comments) => {
        const newReview = {
            group: this.currentGroup,
            reviewee,
            comments,
            reviewer: this.currentUser.name
        }
        this.reviews.push(newReview)
    }

    @computed
    get currentGroupStudents() {
        return this.students.filter(team => team.teamName === this.currentGroup)
            .map(team => team.members)
    }

    @computed
    get currentGroupSubmissions() {
        return this.submissions.filter(submission => submission.group === this.currentGroup)
    }

    @computed
    get currentGroupReviews() {
        return this.reviews.filter(review => review.group === this.currentGroup)
    }

}

export default new HomeworkStore()
