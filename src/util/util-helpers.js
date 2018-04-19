import moment from 'moment'
import locals from './locals';
const BASE_URL = 'http://localhost:3005'
const token = localStorage.getItem("token")

export {
    _patchGroupsModules,
    _getAllWeeks,
    _patchNewModuleForOneGroup,
}

async function _patchGroupsModules({
    item,
    newPosition,
    newDuration,
    teacher1_id,
    teacher2_id,
    group_id
}) {
    // we need position for request and group_name to filter the group id wanted
    const { position } = item
    const body = {
        duration: newDuration,
        position: newPosition,
        teacher1_id,
        teacher2_id
    }
    const res = await locals.request(`${BASE_URL}/api/running/update/${group_id}/${position}`, {
        method: 'PATCH',
        body,
        headers: {
            'Content-Type': 'Application/json',
            'Authorization': 'Bearer ' + token,
        },
    })
    return await res.json()
}


function _getAllWeeks(startingDate, endingDate) {
    const allSundays = []
    let tempDate = startingDate.clone()
    while (tempDate.day(0).isBefore(endingDate)) {
        allSundays.push(moment(tempDate))
        tempDate = tempDate.add(1, 'weeks')
    }

    const allWeeks = allSundays.reduce((acc, prevItem, index, arr) => {
        const nextItem = arr[index + 1]
        if (!nextItem) return acc
        const oneWeek = [prevItem, nextItem]
        acc.push(oneWeek)
        return acc
    }, [])

    return { allWeeks, allSundays }
}



function _patchNewModuleForOneGroup(
    selectedModuleId,
    selectedDate,
    duration,
    selectedGroupId,
    items,
    modules
) {
    const selectedDateMoment = new moment(selectedDate, 'YYYY-MM-DD')
    for (let item of items) {
        // case 1 it is betweeen the staritng and the end! Nasty!!/////////////////////////////////////////////
        if (selectedDateMoment.isBetween(item.starting_date, item.ending_date)) {
            // step 1 make that module shorter so that the new module could come right after
            const newDuration = _getNewDurationWhenAddingModule(
                selectedDateMoment,
                item
            )
            // send to backend the new duration to the backendc
            return _patchGroupsModules({
                item,
                newPosition: item.position,
                newDuration,
                group_id: selectedGroupId
            })
                .then(res => {
                    //step 2 add the new module after that one
                    const position = +item.position + 1
                    // 1- add it
                    return _addModule(selectedModuleId, selectedGroupId, position)
                        .then(res =>
                            // 2- change the duration
                            _patchGroupsModules({
                                item: { position },
                                newDuration: duration,
                                group_id: selectedGroupId
                            })
                        )
                        .then(res => {
                            // step 3 add the new module
                            const remainingDuration = item.duration - newDuration
                            const otherHalfPosition = position + 1
                            const splittedModuleId = modules.filter(
                                one => one.module_name === item.module_name
                            )[0].id
                            return (
                                _addModule(splittedModuleId, selectedGroupId, otherHalfPosition)
                                    // now adjust the duration so that it's just the rest of the module not a new one
                                    .then(res => {
                                        return _patchGroupsModules(
                                            {
                                                item: { position: otherHalfPosition },
                                                newDuration,
                                                group_id: selectedGroupId
                                            })//instead of whole item just the part with position
                                    })
                            )
                        })
                        .catch(err => {
                            console.log(err)
                            return Promise.reject() // maybe to give the user indication that it went wrong
                        })
                })
                .catch(err => {
                    console.log(err)
                    return Promise.reject() // maybe to give the user indication that it went wrong
                })
        }
        if (selectedDateMoment.diff(item.ending_date, 'weeks') === 0) {
            // case 2 the new module is at the end of an existing one (GREAT!)//////////////////////////////////////////////////
            const position = +item.position + 1
            return _addModule(selectedModuleId, selectedGroupId, position).then(res =>
                _patchGroupsModules({
                        item: { position },
                        newDuration: duration,
                        group_id: selectedDate
                    })
            )
        }
    }
}

function _getNewDurationWhenAddingModule(selectedDate, module) {
    return selectedDate.diff(module.starting_date, 'week')
}


async function _addModule(moduleId, groupId, position) {
    const singleModule = await fetch(`${BASE_URL}/api/running/add/${moduleId}/${groupId}/${position}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'Application/json',
            'Authorization': 'Bearer ' + token,
        }
    }
    )
    return await singleModule.json()
        .catch(console.log)
}