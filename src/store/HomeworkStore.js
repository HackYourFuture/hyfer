import { observable, action, configure, runInAction } from "mobx"

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
    homework = []    
    
    @observable
    submissions = []

    @observable
    reviews = []

    @action
    getCurrentUser = async() => {        
        const userData = await getData("user") 
        runInAction(() => {
            this.currentUser = {
                id: userData.id,
                name: userData.full_name || userData.username,
                email: userData.email,
                avatarUrl: `https://avatars.githubusercontent.com/${userData.username}`,
                group: null
            }
        }) 
    }

    @action
    fetchAllData = async (groupName) => {
        this.currentGroup = this.activeGroups.filter(group => group.name === groupName)[0]
        await this.getHomework()
        await this.getActiveGroups()
        await this.getCurrentUser()
        await this.getStudents()
        await this.getSubmissions()
        await this.getReviews()
        await this.getActiveModules()
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
    getHomework = async () => {
        const currentGroupHomework = await getData(`homework/${this.currentGroup.id}`)
        runInAction(() => {
            this.homework = currentGroupHomework
        })  
    }   
    
    @action
    getSubmissions = async () => {
        const currentGroupSubmissions = await getData(`submissions/${this.currentGroup.id}`)
        runInAction(() => {
            this.submissions = currentGroupSubmissions
        })
    }  
    
    @action
    getReviews = async () => {
        const currentGroupReviews = await getData(`reviews/${this.currentGroup.id}`)
        runInAction(() => {
            this.reviews = currentGroupReviews
        })
    }    

    @action
    getActiveModules = async () => {
        const activeModules = await getData("modules/active")
        runInAction(() => {
            this.modules = activeModules
        })
    }    

    @action
    setHomework = async (moduleName, title, githubLink, deadline) => {
        // ADD githublink column to db table
        const module_id = this.modules.filter(module => module.name === moduleName)[0].id
        
        const newHomework = {
            group_id: this.currentGroup.id,
            module_id,
            title,
            deadline
        }
        await postData("homework", newHomework)
        this.getHomework()
    }

    @action
    addSubmission = async (homework_id, github_link, date) => {

        const newSubmission = {
            homework_id,
            group_id: this.currentGroup.id,
            student_id: this.currentUser.id,
            github_link,
            date
        }
        await postData("submissions", newSubmission)
        this.getSubmissions()
    }


    @action
    addReview = async (homework_id, comments, date) => {
        // change homework_id in db to submission_id
        // REMOVE student_id column

        const newReview = {
            homework_id,
            group_id: this.currentGroup.id,
            student_id: 0,
            reviewer_id: this.currentUser.id,
            comments,
            date
        }
        await postData("reviews", newReview)
        this.getReviews()
    }

    @action
    requestReview = (submissionId, title, assignedReviewer) => {
        
        const submitter = this.submissions.filter(submission => submission.id === submissionId)
            .map(submission => submission.username)[0]

        const reviewerEmail = this.students.filter(student => student.username === assignedReviewer)
            .map(student => student.email)[0]

        // send email to reviewerEmail using SendGrid
        // "[assignedReviewer], your review has been requested on [submitter]'s [title] homework"
    }  

}

export default new HomeworkStore()
