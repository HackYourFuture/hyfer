import { notify } from 'react-notify-toast'

export const error_bundle = (e) => {
    // no stack creepy Errors
    const isString = e && typeof e === 'string' && e.length < 100 && !e.stack
    const isNumber = typeof e === 'number'
    const error = param => notify.show(param, 'error')

    if (e.message)
        return error(e.message)
    if (isString || isNumber)
        return error(e)
    else
        return error('Oops Something Went Wrong!')
}
