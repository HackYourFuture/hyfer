import moment from 'moment'

import {
    _patchGroupsModules,
    _getAllWeeks,
    _patchNewModuleForOneGroup,
} from './util-helpers'

import locals from './locals'

const BASE_URL = 'http://localhost:3005'
const token = localStorage.getItem("token")

//return a promise with `then` getting the json formatted data
export function getTimelineItems() {
    return fetch(BASE_URL + '/api/timeline').then(res => res.json())
}

export function setEndingDateForModules(allItems, groups) {
    groups.forEach(group => {
        const items = allItems[group]
        items.sort((a, b) => a.position - b.position) // make sure it is sorted

        let lastDate = '' // will be overwritten by each module of a group to set the ending date

        items.map(item => {
            if (lastDate === '') lastDate = item.starting_date
            item.starting_date = moment(lastDate)

            if (item.starting_date.day() !== 0) {
                console.error(item.starting_date.toString())
                item.starting_date.weekday(0)
            }

            item.ending_date = moment(lastDate).add(item.duration, 'weeks')
            lastDate = moment(item.ending_date)
            return item
        })
    })
    return allItems
}

export function getAllGroupsWithIds() {
    return fetch(`${BASE_URL}/api/groups`, {
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then(res => res.json())
}

export function getAllTotalWeeksAndSundays(allItems) {
    const groups = Object.keys(allItems)

    const onlyModules = groups.reduce((acc, prev) => {
        return acc.concat(...allItems[prev])
    }, [])

    const firstDate = moment.min(onlyModules.map(module => module.starting_date))
    const lastDate = moment.max(onlyModules.map(module => module.ending_date))

    return _getAllWeeks(firstDate, lastDate)
}

export async function getTeachers() {
    const teachers = locals.request(`${BASE_URL}/api/users`, {
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
    return await teachers.json()
}

export function getWeeksBeforeAndAfter(allWeeks, classModules) {

    // starting date of the first module of a class
    const firstModuleStartingDate = moment.min(
        classModules.map(week => week.starting_date)
    )
    // the ending date of the last module of a class
    const lastModuleEndingDate = moment.max(
        classModules.map(week => week.ending_date)
    )
    // get an array with all the weeks before the start of this class
    const weeksBefore = allWeeks.filter(week =>
        week[0].isBefore(firstModuleStartingDate)
    )

    // get an array with all the weeks agter the course has ended
    const weeksAfter = allWeeks.filter(week =>
        week[1].isAfter(lastModuleEndingDate)
    )
    return {
        weeksBefore,
        weeksAfter
    }
}

export function getCurrentWeek(week, width) {
    const today = new moment()
    if (!today.isAfter(week[0]) || !today.isBefore(week[1])) return null
    const dayDiff = today.diff(week[0], 'days')
    const oneDayWidth = width / 7
    const offset = oneDayWidth * dayDiff
    return offset
}

export function weekLonger(chosenModule, groups) {
    const { duration } = chosenModule
    const newDuration = duration + 1
    const groupId = chosenModule.id
    return _patchGroupsModules({
            item: chosenModule,
            newDuration,
            group_id: groupId
        })
}

export function weekShorter(chosenModule, groups) {
    const { duration } = chosenModule
    const newDuration = duration - 1
    const groupId = chosenModule.id

    return _patchGroupsModules({
            item: chosenModule,
            newDuration,
            group_id: groupId
        })
}

export function moveRight(chosenModule, groups) {
    const { position, duration } = chosenModule
    const newPosition = position + 1
    const groupId = chosenModule.id

    return _patchGroupsModules({
            item: chosenModule,
            newPosition,
            newDuration:duration,
            group_id: groupId
        })
}

export function moveLeft(chosenModule, groups) {
    const { position, duration } = chosenModule
    const newPosition = position - 1
    const groupId = chosenModule.id

    return _patchGroupsModules({
            item:chosenModule,
            newPosition,
            newDuration: duration,
            group_id:groupId
        })
}

export function removeModule(chosenModule) {
    const { id, position } = chosenModule
    const token = localStorage.getItem("token")
    return fetch(`${BASE_URL}/api/running/${id}/${position}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'Application/json',
            'Authorization': 'Bearer ' + token,
        },
    }).then(res => res.json())
}

export function getModulesOfGroup(groupId) {
    return fetch(`${BASE_URL}/api/running/${groupId}`, {
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
        .then(res => res.json())
}

////////////////////////////////////////////////////////////////// helper functions


// this is not used yet cause there's nothing shown to user to invoke it
export function assignTeachers(item, groupsId, teacher1_id, teacher2_id) {
    return _patchGroupsModules({
        item,
        newDuration: item.duration,
        teacher1_id,
        teacher2_id,
        group_id: groupsId
    })
}

export function addNewClass(className, starting_date) {
    const date = new Date(starting_date)
    const body = {
        group_name: className,
        starting_date: date.toISOString()
    }

    return fetch(`${BASE_URL}/api/groups`, {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(body)
    })
}

export async function getALlPossibleModules() {
    const res = await locals.request(`${BASE_URL}/api/modules`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    return await res.json()
}

export function getAllSharedDates(items) {
    const keys = Object.keys(items)
    const minAndMax = keys.reduce(
        (acc, key) => {
            const modules = items[key]
            const startingsOfModule = modules.map(module => module.starting_date)
            let minCurrentModules = moment.min(startingsOfModule)
            if (minCurrentModules.day() !== 0) {
                const daysToSunday = 7 - minCurrentModules.day()
                for (let x = 0; x < daysToSunday; x++) {
                    minCurrentModules.add(1, 'day')
                }
            }
            const endingsOfModule = modules.map(module => module.ending_date)
            const maxCurrentModules = moment.max(endingsOfModule)
            if (acc.min && acc.max) {
                const min =
                    minCurrentModules.diff(acc.min) > 0 ? minCurrentModules : acc.min
                const max =
                    maxCurrentModules.diff(acc.max) < 0 ? maxCurrentModules : acc.max
                return {
                    min,
                    max
                }
            } else {
                return {
                    min: minCurrentModules,
                    max: maxCurrentModules
                }
            }
        },
        { min: '', max: '' }
    )
    return minAndMax
}

export function addNewModuleToClass(
    selectedModuleId,
    selectedGroup,
    duration,
    selectedDate,
    items,
    modules
) {
    if (selectedGroup !== 'All classes') {
        return _patchNewModuleForOneGroup(
            selectedModuleId,
            selectedDate,
            duration,
            selectedGroup.id,
            items,
            modules
        )
    } else {
        const allGroups = Object.keys(items)
        let allPromises = []
        allGroups.forEach(group => {
            const groupsItems = items[group]
            const groupId = groupsItems[0].id
            allPromises.push(
                _patchNewModuleForOneGroup(
                    selectedModuleId,
                    selectedDate,
                    duration,
                    groupId,
                    groupsItems,
                    modules
                )
            )
        })
        return Promise.all(allPromises).then('Fulfilled')
    }
}
