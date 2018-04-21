import marked from 'marked'
import moment from 'moment'

import locals from '../util/locals'
import { REPO_NAME_CHANGED, READ_ME_CHANGED, HISTORY_CHANGED } from './'

const { REACT_APP_REPOS_URL } = process.env
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
            _getRepoNameAndSundays(clickEvent);
            getReadme();

            const {
                group_id,
                running_module_id,
                group,
                duration,
                repoName,
                start,
                end
            } = _data
            const modeuleSundays = _getSundays(start, end)
            const sundays = { sundays: modeuleSundays }
            const token = localStorage.getItem("token")
            const REACT_APP_API_HISTORY_URL = process.env
            // sundays format => {sundays: ["2016/11/06", "2016/11/13", "2016/11/20"]}

            const res = await locals.request(`${REACT_APP_API_HISTORY_URL}/${running_module_id}/${group_id}`, {
                method: 'PATCH',
                body: sundays,
            })
            const jsonRes = await res.json()
            const students = Object.keys(jsonRes)
            setState({
                type: HISTORY_CHANGED,
                payload: {
                    history: jsonRes,
                    students: students,
                    duration: duration,
                    repoName: repoName,
                    group_name: group
                }
            })
        }
    }

    const getReadme = async () => {
        // check if there is a valid repoName
        if (!_data.repoName || _data.repoName === noRepoAlternative) return
        // make the request

        const res = await locals.request(`${REACT_APP_REPOS_URL}/${_data.repoName}/readme`)
        const readmeEncoded = await res.json()
        const readmeDecoded = atob(readmeEncoded.content)
        const readmeHtml = marked(readmeDecoded)

        setState({
            type: READ_ME_CHANGED,
            payload: {
                readme: readmeHtml
            }
        })
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
        const res = await locals.request(`${REACT_APP_REPOS_URL}/${defaultRepo}/readme`)
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
        setState({
            type: REPO_NAME_CHANGED,
            payload: {
                repoName: defaultRepo
            }
        })
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
