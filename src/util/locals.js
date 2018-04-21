
const token = localStorage.getItem("token")

class locals {
    request(url, { method, body, headers, credentials }, callback, ...args) {
        console.log('request:', method || 'GET', url) // temproray
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
                if (process.env.NODE_ENV === 'development') {
                    return (callback) ? callback(args) : console.error(error)
                }
                return (callback) ? callback(args) : error
            })
    }
}

export default new locals()
