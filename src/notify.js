import { notify } from 'react-notify-toast'

const error_bundle = (e) => {
    if (e.message) return notify.show(e.message, 'error')
    if (e) return notify.show(e, 'error')
    else return notify.show('Oops Something Went Wrong!', 'error')
}

export default {
    error_bundle
}