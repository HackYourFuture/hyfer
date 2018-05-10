import { observable, action, computed, configure, runInAction } from "mobx"
import { getAllGroupsWithIds, getModulesOfGroup, getAllPossibleModules } from "../util"


configure({ enforceActions: true })

const token = localStorage.getItem("token")
const fetchConfig = {
    credentials: "same-origin",
    headers: {
        "Authorization": "Bearer " + token,
    }
}

const email = "student-email@email.com"
const avatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8nQvB-OC1ZaSZDN1dhyhyoysd0bDUM20JqcDg2uzc2Nc63smYtA"
const githubLink = "https://github.com/HackYourFuture"


export const studentClasses = ["class12", "class13", "class14", "class15"]


class HomeworkStore {

    @observable 
    currentUser = {} 
    
    @observable
    activeGroups = []

    @observable
    students = [
        { name: "Nagham", group: "class12", avatar, email },
        { name: "Talal", group: "class12", avatar, email },
        { name: "Chileshe", group: "class12", avatar, email },
        { name: "Student-1", group: "class13", avatar, email },
        { name: "Student-2", group: "class13", avatar, email },
        { name: "Student-A", group: "class14", avatar, email },
        { name: "Student-B", group: "class14", avatar, email },
        { name: "Student-X", group: "class15", avatar, email },
        { name: "Student-Y", group: "class15", avatar, email },
    ]
    

    @observable
    submissions = [
        { group: "class12", submitter: "Nagham", githubLink },
        { group: "class13", submitter: "Student-1", githubLink },
        { group: "class14", submitter: "Student-B", githubLink },
        { group: "class15", submitter: "Student-Y", githubLink }
    ]

    @observable
    reviews = [
        { group: "class12", reviewer: "Nagham", reviewee: "Talal", comments: "Well done!" },
        { group: "class12", reviewer: "Talal", reviewee: "Chileshe", comments: "Your css needs work" },
        { group: "class13", reviewer: "Student-1", reviewee: "Student-2", comments: "Good job!" },
        { group: "class14", reviewer: "Student-A", reviewee: "Student-B", comments: "Keep it up!" },
        { group: "class15", reviewer: "Student-Y", reviewee: "Student-X", comments: "You did a great job!" }
    ]

    @action
    getCurrentUser = async () => {        
        const res = await fetch('http://localhost:3005/api/user', fetchConfig)
        const userData = await res.json()
        this.currentUser = {
            name: userData.full_name || userData.username,
            email: userData.email,
            avatar: `https://avatars.githubusercontent.com/${userData.username}`,
            group: null
        }
        runInAction(() => {
            this.students.push(this.currentUser)
        })
        
    }

    @action
    getActiveGroups = async () => {
        const groups = await getAllGroupsWithIds()
        const activeGroups = groups.splice(groups.length - 4)
        runInAction(() => {
            this.activeGroups = activeGroups.map(group => group.group_name.replace(/ /g, "").toLowerCase())
        })
    }

    @action
    getStudents = async () => {
        const groups = await fetch(`https://api.github.com/orgs/hackyourfuture/teams`, {   
            headers: {
                "Authorization": "Bearer " + token,
                "User-Agent": "hackyourfuture"
            }   
        })
        const teams = await groups.json()
        console.log(teams)
    }

}

export default new HomeworkStore()
