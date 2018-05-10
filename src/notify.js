import { notify } from 'react-notify-toast'

export const error_bundle = (e) => {
    // no stack creepy Errors
    const isString = e && typeof e === 'string' && e.length < 100
    const isNumber = typeof e === 'number'
    
    if (e.message) return notify.show(e.message, 'error')
    if (isString || isNumber) return notify.show(e, 'error')
    else return notify.show('Oops Something Went Wrong!', 'error')
}
