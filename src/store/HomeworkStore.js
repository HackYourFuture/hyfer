import { observable, action, configure, runInAction } from "mobx"
import { sendAnEmail } from "../util";

configure({ enforceActions: true })

const token = localStorage.getItem("token")
const API_Root = "http://localhost:3005/api"


export async function getData(route) {
    const res = await fetch(`${API_Root}/${route}`, {
        credentials: "same-origin",
        headers: {
            "Authorization": "Bearer " + token,
        }
    })
    return await res.json()
}

async function postData(route, data) {
    await fetch(`${API_Root}/${route}`, {
        method: 'POST',
        headers: {
            "Content-Type": "Application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(data)
    })
}

function getAvatarUrl(username) {
    return `https://avatars.githubusercontent.com/${username}`
}



class HomeworkStore {

    @observable 
    currentUser = {} 

    @observable
    currentGroup = {}     
    
    @observable
    activeGroups = []

    @observable
    students = []   
    
    @observable
    modules = [] 

    @observable
    assignments = []    
    
    @observable
    submissions = []

    @observable
    reviews = []

    @observable
    assignmentSubmitters = []  

    @observable
    unassignedReviewers = []
    
    @action
    getCurrentUser = async() => {        
        const userData = await getData("user") 
        runInAction(() => {
            this.currentUser = {
                id: userData.id,
                username: userData.username,
                full_name: userData.full_name,
                email: userData.email,
                avatarUrl: `https://avatars.githubusercontent.com/${userData.username}`,
                group: null
            }
        }) 
    }

    @action
    fetchAllData = async (groupName) => {
        this.currentGroup = this.activeGroups.filter(group => group.name === groupName)[0]
        await this.getHomework("assignments")
        await this.getActiveGroups()
        await this.getCurrentUser()
        await this.getStudents()
        await this.getHomework("submissions")
        await this.getHomework("reviews")
        await this.getHomeworkModules()
    }  
    
    @action
    getActiveGroups = async () => {
        const groups = await getData("groups")
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
        const currentGroupStudents = await getData(`students/${this.currentGroup.id}`)
        const studentsWithAvatars = currentGroupStudents.map(student => (
            { ...student, avatarUrl: getAvatarUrl(student.username) }
        ))
        runInAction(() => {
            this.students = studentsWithAvatars
        })   
    }
    

    @action 
    getHomework = async (dataType) => {
        const homeworkData = await getData(`${dataType}/${this.currentGroup.id}`)
        runInAction(() => {
            this[dataType] = homeworkData
        }) 
    } 
    
    @action
    getAssignmentSubmitters = async (assignmentId) => {
        const submitters = await getData(`submitters/${assignmentId}`)
        runInAction(() => {
            this.assignmentSubmitters = submitters
            this.unassignedReviewers = submitters
        })
    }
    
    @action
    getHomeworkModules = async () => {
        const homeworkModules = await getData("modules/homework")
        runInAction(() => {
            this.modules = homeworkModules
        })
    } 
    
    @action
    updateReviewers = (selectedReviewer) => {
        const availableReviewers = this.unassignedReviewers.filter(reviewer => reviewer.username !== selectedReviewer)
        this.unassignedReviewers = availableReviewers
    }

    @action
    updateSubmitters = (submitterName) => {
        const updatedSubmitters = this.assignmentSubmitters.filter(submitter => submitter.username !== submitterName)
        this.assignmentSubmitters = updatedSubmitters
    } 

    @action
    addAssignment = async (moduleName, title, assignment_link, deadline) => {
        const module_id = this.modules.filter(module => module.name === moduleName)[0].id
        
        const newHomework = {
            group_id: this.currentGroup.id,
            module_id,
            title,
            assignment_link,
            deadline
        }
        await postData("assignments", newHomework)
        this.getHomework("assignments")
    }

    @action
    addSubmission = async (assignment_id, github_link, date) => {

        const newSubmission = {
            assignment_id,
            submitter_id: this.currentUser.id,
            github_link,
            date
        }
        await postData("submissions", newSubmission)
        this.getHomework("submissions")

    }

    @action
    addReview = async (submission_id, comments, date) => {

        const newReview = {
            submission_id,
            reviewer_id: this.currentUser.id,
            comments,
            date
        }
        await postData("reviews", newReview)
        this.getHomework("reviews")
    }

    @action
    requestReview = (submitter, assignmentTitle, assignedReviewer) => {
        console.log(this.students.filter(student => student.username === assignedReviewer))
        const reviewerEmail = this.students.filter(student => student.username === assignedReviewer)
            .map(student => student.email)[0]
            
            // send email to reviewerEmail using SendGrid
        if (reviewerEmail) {
            sendAnEmail(
                reviewerEmail,
                "hyfer@gmx.com" ,  // a new email account has been created for hyfer
                "requesting a review for homework",
                `Dear student,

                 Would you please give a feedback for ${submitter}'s homework (${assignmentTitle}).
                 
                 Hyfer`
            )
           console.log("Email sent successfully")
        }
        else {
            console.log("reviewer email is undefined")
        }
      
    }  

}

export default new HomeworkStore()
