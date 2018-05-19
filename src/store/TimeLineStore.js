import {
    TIMELINE_GROUPS_CHANGED,
    TIMELINE_ITEMS_CHANGED,
    ALL_WEEKS_CHANGED,
    ALL_POSSIBLE_MODULES_CHANGED,
    ALL_SUNDAYS_CHANGED,
    ALL_TEACHERS_CHAGNED,
    INFO_SELECTED_MDOULE_CHANGED,
    GROUPS_WITH_IDS_CHANGED
} from "./"

import {
    getAllTotalWeeksAndSundays,
    getTimelineItems,
    setEndingDateForModules,
    weekLonger,
    weekShorter,
    moveLeft,
    moveRight,
    assignTeachers,
    addNewClass,
    getALlPossibleModules,
    addNewModuleToClass,
    removeModule,
    getAllSharedDates,
    getTeachers,
    getModulesOfGroup,
    getAllGroupsWithIds
} from "../util"

import { error_bundle } from '../notify'

const BASE_URL = "http://localhost:3005"

export default function () {
    let _observers = []
    let _data = {}

    const subscribe = observer => {
        _observers.push(observer)
    }

    const unsubscribe = observer => {
        _observers = _observers.filter(item => item !== observer)
    }

    const isSubscribed = observer => {
        return _observers.includes(observer)
    }

    const setState = merge => {
        let old = {}
        for (let changedItemKey in merge.payload) {
            if (_data.hasOwnProperty(changedItemKey)) {
                old[changedItemKey] = merge.payload[changedItemKey]
            }
            _data[changedItemKey] = merge.payload[changedItemKey]
        }

        _observers.forEach(observer => observer(merge, old))
    }

    const getState = () => {
        return _data
    }

    const fetchItems = async isTeacher => {
        const timelineItems = await getTimelineItems(
            BASE_URL + "/api/timeline"
        ).catch(error_bundle)

        // set the state with the array of all current groups [maybe needed for sidecolumn group names]
        const groups = Object.keys(timelineItems)
        groups.sort((group1, group2) => {
            return +group1.split(" ")[1] > +group2.split(" ")[1]
        })
        const orderedTimelineItems = {}
        groups.forEach(group => {
            orderedTimelineItems[group] = timelineItems[group]
        })

        const groupsWithIds = await getAllGroupsWithIds()

        setState({
            type: GROUPS_WITH_IDS_CHANGED,
            payload: {
                groupsWithIds
            }
        })

        const withEndingDate = setEndingDateForModules(orderedTimelineItems, groups) // group names
        // set the state with the new received items
        setState({
            type: TIMELINE_ITEMS_CHANGED,
            payload: {
                items: withEndingDate
            }
        })

        // get all possible modules for addition
        const allPossibleModules = await getALlPossibleModules().catch(e => {
            // we don't need any return on all of the users
            // On 403 Forbidden
            if (e.status === 403) return
            // if the user has any other problems?!
            error_bundle(e)
        })
        setState({
            type: ALL_POSSIBLE_MODULES_CHANGED,
            payload: {
                modules: allPossibleModules
            }
        })

        // get all sundays and count how many weeks
        const {
            allWeeks,
            allSundays
        } = getAllTotalWeeksAndSundays(withEndingDate)

        //set State with all sundays
        setState({
            type: ALL_SUNDAYS_CHANGED,
            payload: {
                allSundays
            }
        })

        // Set state with all weeks moments
        setState({
            type: ALL_WEEKS_CHANGED,
            payload: {
                allWeeks
            }
        })

        if (isTeacher) {
            getTeachers().then(res => {
                const teachers = res.filter(user => user.role === "teacher")
                setState({
                    type: ALL_TEACHERS_CHAGNED,
                    payload: {
                        teachers
                    }
                })
            }).catch(error_bundle)
        }


        setState({
            type: TIMELINE_GROUPS_CHANGED,
            payload: {
                // TODO:
                groups
            }
        })

        // set state with total weeks during all known schedule for current classes
    }

    const updateModule = (module, action) => {
        let result = null
        switch (action) {
            case "weekLonger":
                result = weekLonger(module)
                break
            case "removeModule":
                result = removeModule(module)
                break
            case "weekShorter":
                result = weekShorter(module, getState().groups)
                break
            case "moveLeft":
                result = moveLeft(module, getState().groups)
                break
            case "moveRight":
                result = moveRight(module, getState().groups)
                break
            default:
                break
        }

        result
            .then(() => {
                return fetchItems()
            })
            .catch(error_bundle)
    }

    const handleAssignTeachers = (item, teacher1, teacher2) => {
        return (
            // item.id is the id of the group
            assignTeachers(item, item.id, teacher1, teacher2)
            // when done go back throught the whole procedure to get the items on screen
            .then(() => {
                fetchItems()
            })
                .catch(error_bundle)
        )
    }

    const handleAddModule = (
        selectedModuleId,
        selectedGroup,
        duration,
        selectedDate,
        items
    ) => {
        const {
            modules
        } = _data // getting all modules from the store directly
        // make all the computations in util
        return addNewModuleToClass(
            selectedModuleId,
            selectedGroup,
            duration,
            selectedDate,
            items,
            modules
        ).then(res => { // catching the error By propagation in  src/components/timelineComp/Buttons/AddDropdownList/AddNewModuleModal/AddNewModuleModal.js
            fetchItems()
        })
    }

    const addTheClass = (className, starting_date) => {
        return addNewClass(className, starting_date).then(() => fetchItems())
    }

    const getSharedDates = items => {
        return getAllSharedDates(items)
    }

    const getSelectedModuleInfo = item => {
        // give it to util to handle
        getModulesOfGroup(item.id)
            .then(res => {
                setState({
                    type: INFO_SELECTED_MDOULE_CHANGED,
                    payload: {
                        allModulesOfGroup: res[item.position]
                    }
                })
            })
            .catch(error_bundle)
    }

    return {
        subscribe,
        unsubscribe,
        isSubscribed,
        getState,
        setState,
        fetchItems,
        updateModule,
        handleAddModule,
        addTheClass,
        getSharedDates,
        handleAssignTeachers,
        getSelectedModuleInfo
    }
}