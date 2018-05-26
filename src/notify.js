import { notify } from 'react-notify-toast'

export const errorMessage = (e) => {
    // no stack creepy Errors
    const isString = e && typeof e === 'string' && e.length < 100 && !e.stack
    const isNumber = typeof e === 'number'
    const error = param => notify.show(param, 'error')

    if (e && e.status && e.statusText) {
        // check any status Messages First
        return error(`${e.status} | ${e.statusText}`)
    }
    if (e && e.message) {
        return error(e.message)
    }
    if (isString || isNumber) {
        // a normal plain text?
        return error(e)
    }
    // in fail all Cases!!
    return error('Oops Something Went Wrong!')
}

export const success = (note) => {

    const message = param => notify.show(param, 'success')

    if (!note) {
        // contains something?!
        return errorMessage(note)
    }
    return message(note)
}

export const warning = (warn) => {

    const message = param => notify.show(param, 'warning')

    if (!warn) {
        // contains something?!
        return errorMessage(warn)
    }
    return message(warn)
}
