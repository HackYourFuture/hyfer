
const token = localStorage.getItem("token")

class locals {
    request(url, { method, body, headers, credentials }, errorCallback, ...args) {
        // the first arg here will be equal to the error in the catch method
        const { NODE_ENV } = process.env
        if (NODE_ENV === 'development') {
            console.log('request:', method || 'GET', url) // temproray
        }
        const params = {
            body: JSON.stringify(body),
            credentials: credentials || 'same-origin',
            method: method,
            headers: headers,
        }

        let options = {}
        if (!params.body) {
            delete params.body
        }
        switch (method) {
            case 'PATCH':
            case 'POST':
            case 'DELETE':
                if (!headers) {
                    params.headers = {
                        'Content-Type': 'Application/json',
                        'Authorization': 'Bearer ' + token,
                    }
                }
                break
            default:
                if (!headers) {
                    params.headers = {}
                }
                params.method = 'GET'
                break
        } // Switch
        options = { method, ...params }
        return fetch(url, options)
            .catch(error => {
                if (NODE_ENV === 'development') {
                    return (errorCallback) ? errorCallback(args) : console.error(error)
                }
                // no args! ... asign the error to args
                if (!args) args = error
                // no errorCallback! ... return the error to do something else with it
                if (!errorCallback) return error
                // otherwise just call the errorCallback
                if (errorCallback) return errorCallback(args)
            })
    }
}

export default new locals()
