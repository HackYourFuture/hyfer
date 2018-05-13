import marked from 'marked'
import moment from 'moment'
import { error_bundle } from '../notify'

import {
    REPO_NAME_CHANGED,
    READ_ME_CHANGED,
    HISTORY_CHANGED
} from './'

const BASE_URL = 'https://api.github.com/repos/HackYourFuture'
const noRepoAlternative = 'NOREPO' // alternative name for if a module doesn't have a repo

export default function () {
    let _observers = []
    let _data = {}
    const subscribe = observer => {
        _observers.push(observer)
    }

    const unsubscribe = observer => {
        _observers = _observers.filter(item => item !== observer)
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

    // Normal method's will be changing the state

    const getHistory = async (clickEvent, isATeacher) => {

        if (!isATeacher) {
            _getRepoNameAndSundays(clickEvent)
            getReadme()
        } else {
            _getRepoNameAndSundays(clickEvent)
            getReadme()
            const {
                group_id,
                running_module_id,
                group,
                duration,
                repoName,
                start,
                end
            } = _data
            let moduleSundays = _getSundays(start, end)
            let sundays = {
                sundays: moduleSundays
            }
            const token = localStorage.getItem("token")
            let BASE_URL = 'http://localhost:3005/api/history'
            try {
                const res = await fetch(`${BASE_URL}/${running_module_id}/${group_id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(sundays),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    }
                })
                if (!res.ok) throw res
                const response = await res.json()
                const students = Object.keys(response)
                setState({
                    type: HISTORY_CHANGED,
                    payload: {
                        history: response,
                        students: students,
                        duration: duration,
                        repoName: repoName,
                        group_name: group
                    }
                })
            } catch (err) {
                error_bundle(err)
            }
        }
    }
    const getReadme = async () => {
        // check if there is a valid repoName
        if (!_data.repoName || _data.repoName === noRepoAlternative) return
        // make the request
        try {
            const response = await fetch(`${BASE_URL}/${_data.repoName}/readme`)
            const readmeEncoded = await response.json()
            const readmeDecoded = atob(readmeEncoded.content)
            const readmeHtml = marked(readmeDecoded)

            setState({
                type: READ_ME_CHANGED,
                payload: {
                    readme: readmeHtml
                }
            })

        } catch (err) {
            error_bundle(err)
        }
    }

    // Helper methods used to help the state changing methods above

    const _getRepoNameAndSundays = clickEvent => {
        // it is a promise because it is being used in the getReadme function and that one won't wait
        let repoName = null
        const target = clickEvent.target
        const dataset = target.dataset
        const {
            start,
            end,
            repo,
            group_id,
            group,
            running_module_id,
            duration
        } = dataset

        // if the selected element doesn't have a repo
        if (!repo) {
            repoName = noRepoAlternative
            setState({})
        } else {
            repoName = repo
        }

        const mergedData = {
            type: REPO_NAME_CHANGED,
            payload: {
                repoName,
                group_id,
                running_module_id,
                duration,
                start,
                end,
                group
            }
        }
        setState(mergedData)
    }

    const _getSundays = (startString, endString) => {
        // note: not passing just a string because moment is throwing a warning about the format of the string
        const start = moment(new Date(startString))
        const end = moment(new Date(endString))
        const allSundays = []
        while (start.day(0).isBefore(end)) {
            allSundays.push(start.clone().format('YYYY/MM/DD'))
            start.add(1, 'weeks')
        }
        return allSundays
    }

    const defaultReadme = async defaultRepo => {
        try {
            const res = await fetch(`${BASE_URL}/${defaultRepo}/readme`)
            const readmeEncoded = await res.json()
            const readmeDecoded = atob(readmeEncoded.content)
            const readmeHtml = marked(readmeDecoded)

            setState({
                type: READ_ME_CHANGED,
                payload: {
                    readme: readmeHtml,
                    repoName: defaultRepo
                }
            })

        } catch (err) {
            error_bundle(err)
        }
    }

    return {
        subscribe,
        unsubscribe,
        getState,
        setState,
        getReadme,
        getHistory,
        defaultReadme
    }
}